"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { SEARCH_PRODUCT } from "../schema/Product";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Slider,
  IconButton,
  Drawer,
  Button,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";

export default function SearchResults() {
  const { AddToCart } = useCart();
  const params = useSearchParams();
  const query = params.get("query") || "";
  const category = params.get("category") || "All";

  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  const variables = useMemo(
    () => ({
      query,
      category,
      sortBy,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      limit: 20,
      page: 1,
    }),
    [query, category, sortBy, priceRange]
  );

  const { loading, fetchMore, refetch } = useQuery(SEARCH_PRODUCT, {
    variables,
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      const items = res?.searchProducts ?? [];
      setProducts(items);
      setPage(1);
    },
  });

  // Refetch on query/category change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    refetch({ ...variables, page: 1 });
  }, [query, category]);

  // Load more for infinite scroll
  const loadMore = async () => {
    const nextPage = page + 1;
    const more = await fetchMore({ variables: { ...variables, page: nextPage } });
    const newItems = more?.data?.searchProducts ?? [];
    if (newItems.length) {
      setProducts((prev) => [...prev, ...newItems]);
      setPage(nextPage);
    }
  };

  const hasMore = products.length % variables.limit === 0 && products.length !== 0;

  // Filter controls (Drawer + desktop)
  const FilterControls = (
    <Box sx={{ p: 2, width: isMobile ? 280 : "auto" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filters
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <Select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
            setProducts([]);
            refetch({ ...variables, sortBy: e.target.value, page: 1 });
          }}
        >
          <MenuItem value="relevance">Relevance</MenuItem>
          <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
          <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
          <MenuItem value="newest">Newest Arrivals</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Price Range
      </Typography>
      <Slider
        value={priceRange}
        onChange={(e, val) => setPriceRange(val)}
        onChangeCommitted={(e, val) => {
          const [min, max] = val;
          setPage(1);
          setProducts([]);
          refetch({ ...variables, minPrice: min, maxPrice: max, page: 1 });
        }}
        valueLabelDisplay="auto"
        min={0}
        max={1000}
      />
    </Box>
  );

  if (loading && products.length === 0)
    return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          Results for "<strong>{query}</strong>" in <strong>{category}</strong>
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)}>
            <FilterListIcon />
          </IconButton>
        )}
      </Box>

      {/* Desktop filters */}
      {!isMobile && <Box sx={{ mb: 3 }}>{FilterControls}</Box>}

      {/* Mobile drawer filters */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {FilterControls}
        <Button
          onClick={() => setDrawerOpen(false)}
          sx={{ m: 2 }}
          variant="contained"
          color="success"
        >
          Apply Filters
        </Button>
      </Drawer>

      {/* Product list */}
      <InfiniteScroll
        dataLength={products.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<CircularProgress sx={{ m: 4 }} />}
        endMessage={
          <Typography
            align="center"
            sx={{ my: 3, color: "text.secondary" }}
          >
            End of results
          </Typography>
        }
      >
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={6} sm={4} md={3} key={product.id}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={product.imageUrl || "/placeholder.png"}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.category}
                  </Typography>
                  <Typography variant="h6" color="green">
                    ${product.price}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => AddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Box>
  );
}
