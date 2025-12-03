"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Container,
  Autocomplete,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  Info as InfoIcon,
  ContactPage as ContactPageIcon,
  ExpandLess,
  ExpandMore,
  ShoppingBasket as ShoppingBasketIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "../../context/AuthContext";
import debounce from "lodash.debounce";
import SignupModal from "@/app/components/auth/SignupModal";
import LoginModal from "@/app/components/auth/LoginModal";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const DesktopSearch = dynamic(
  () => import("@/app/components/search/DesktopSearch"),
  { ssr: false }
);

const MobileSearch = dynamic(
  () => import("@/app/components/search/MobileSearch"),
  { ssr: false }
);

export default function TopNavbar({ onSearch }) {
  const router = useRouter();
  const pathname = usePathname();
  const { cart } = useCart();
  const { user, logout, alert, closeAlert } = useAuth();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Add this handler
  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      router.push(
        `/search?query=${encodeURIComponent(
          searchText
        )}&category=${encodeURIComponent(selectedCategory)}`
      );
    }
  };

  // Example: fetch autocomplete suggestions (GraphQL or REST)
  useEffect(() => {
    if (searchText.length > 1) {
      // Replace with your backend call
      fetch(`/api/products/suggestions?query=${searchText}&category=${selectedCategory}`)

        .then((res) => res.json())
        .then((data) => {
          setOptions(
            data.map((p) => ({
              label: p.name,
              imageUrl: p.imageUrl || "/placeholder.png",
            }))
          );
        })
        .catch((err) => console.error("Error fetching suggestions:", err));
    }
  }, [searchText, selectedCategory]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        // You can either call your backend suggestions here
        // or just update state
        if (onSearch && typeof onSearch === "function") {
          onSearch(query, selectedCategory);
        }
      }, 500),
    [onSearch, selectedCategory]
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const totalItems = mounted
    ? cart.reduce((acc, item) => acc + (item.quantity || 1), 0)
    : 0;

  // Auth modals
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const handleSwitchToLogin = () => {
    setOpenSignup(false);
    setOpenLogin(true);
  };
  const handleSwitchToSignup = () => {
    setOpenLogin(false);
    setOpenSignup(true);
  };

  // Drawer & menus
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCollapse, setDrawerCollapse] = useState({});

  const navItems = [
    // {
    //   label: "Products",
    //   path: "/products",
    //   icon: <StoreIcon />,
    //   subItems: [
    //     { label: "Vegetables", path: "/products/vegetables" },
    //     { label: "Fruits", path: "/products/fruits" },
    //     { label: "Frozen Foods", path: "/products/frozen-foods" },
    //     { label: "Drinks", path: "/products/drinks" },
    //     { label: "Snacks & Breads", path: "/products/snacks-bread" },
    //     { label: "Meats", path: "/products/meats" },
    //     { label: "Seafoods", path: "/products/seafoods" },
    //   ],
    // },
    { label: "About", path: "/about", icon: <InfoIcon /> },
    { label: "Contact", path: "/contact", icon: <ContactPageIcon /> },
  ];

  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const toggleDrawerCollapse = (label) =>
    setDrawerCollapse((prev) => ({ ...prev, [label]: !prev[label] }));
  const handleProfileOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);
  const handleLogoutClick = () => {
    handleProfileClose();
    logout();
    router.push("/");
  };

  // Drawer content
  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
        }}
      >
        <img
          spacing={3}
          src="/logos/grocery-cart.png"
          alt="FreshMart Logo"
          style={{
            width: 48,
            height: 48,
            objectFit: "contain",
            marginRight: 8,
          }}
        />
        <Typography
          variant="h6"
          sx={{ m: 2, display: "flex", alignItems: "center" }}
        >
          FreshMart
        </Typography>
      </Link>
      <Divider />
      {/* Mobile search inside drawer */}
      <Box sx={{ px: 2, pb: 2, mt: 3 }}>
        {/* <TextField
          select
          size="small"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ width: "100%", mb: 1 }}
        >
          {["All", "Fruits", "Vegetables", "Drinks", "Snacks"].map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField> */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={searchText}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon
                  sx={{ color: "green", cursor: "pointer", fontSize: 20 }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider />

      <List>
        {navItems.map((item) =>
          item.subItems ? (
            <Box key={item.label}>
              <ListItemButton onClick={() => toggleDrawerCollapse(item.label)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {drawerCollapse[item.label] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse
                in={drawerCollapse[item.label]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.subItems.map((sub) => (
                    <ListItemButton
                      key={sub.path}
                      component={Link}
                      href={sub.path}
                      sx={{ pl: 4 }}
                      selected={pathname === sub.path}
                      onClick={toggleDrawer(false)}
                    >
                      <ListItemText primary={sub.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          ) : (
            <ListItemButton
              key={item.path}
              component={Link}
              href={item.path}
              selected={pathname === item.path}
              onClick={toggleDrawer(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        )}

        <Divider />

        {!user ? (
          <>
            <ListItemButton onClick={() => setOpenSignup(true)}>
              <ListItemText primary="Sign Up" />
            </ListItemButton>
            <ListItemButton onClick={() => setOpenLogin(true)}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton
              component={Link}
              href="/profile"
              selected={pathname === "/profile"}
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary="My Account" />
            </ListItemButton>
            <ListItemButton onClick={logout}>
              <ListItemText />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "green" }}>
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <img
                src="/logos/grocery-cart.png"
                alt="FreshMart Logo"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "contain",
                  marginRight: 8,
                }}
              />
              <Typography
                variant="h6"
                color="white"
                sx={{ display: "flex", alignItems: "center" }}
              >
                FreshMart
              </Typography>
            </Link>

            {/* Desktop search */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                bgcolor: "white",
                borderRadius: 2,
                px: 1,
                py: 0.5,
                boxShadow: 1,
                width: { sm: 320, md: 400 },
                mr: 2,
              }}
            >
              {/* <TextField
                select
                size="small"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{
                  width: 100,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  mr: 1,
                }}
              >
                {["All", "Fruits", "Vegetables", "Drinks", "Snacks"].map(
                  (cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  )
                )}
              </TextField> */}

              <DesktopSearch
                options={options}
                searchText={searchText}
                setSearchText={setSearchText}
                debouncedSearch={debouncedSearch}
              />
            </Box>

            {/* Mobile search icon */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                sx={{ display: { xs: "flex", sm: "none" } }}
                onClick={() => setMobileSearchOpen(true)}
              >
                <SearchIcon sx={{ color: "white" }} />
              </IconButton>

              {!user ? (
                <>
                  <Button
                    sx={{ color: "white" }}
                    onClick={() => setOpenSignup(true)}
                  >
                    Sign Up
                  </Button>
                  <Button
                    sx={{ color: "white" }}
                    onClick={() => setOpenLogin(true)}
                  >
                    Login
                  </Button>
                </>
              ) : (
                <IconButton color="inherit" onClick={handleProfileOpen}>
                  <AccountCircle />
                </IconButton>
              )}

              <IconButton color="inherit" component={Link} href="/cart">
                <Badge badgeContent={totalItems} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <IconButton
                edge="end"
                color="inherit"
                sx={{ display: { sm: "none" } }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile slide-down search */}
      {mobileSearchOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            bgcolor: "white",
            zIndex: 1400,
            p: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            animation: "slideDown 0.3s ease",
            "@keyframes slideDown": {
              from: { transform: "translateY(-100%)" },
              to: { transform: "translateY(0)" },
            },
          }}
        >
          <IconButton onClick={() => setMobileSearchOpen(false)}>
            <MenuIcon />
          </IconButton>

          {/* <TextField
            select
            size="small"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ width: 100 }}
          >
            {["All", "Fruits", "Vegetables", "Drinks", "Snacks"].map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField> */}

          {/* Desktop */}
          <MobileSearch
            options={options}
            searchText={searchText}
            setSearchText={setSearchText}
            debouncedSearch={debouncedSearch}
          />

          <Button
            variant="contained"
            sx={{ bgcolor: "green" }}
            onClick={() => {
              handleSearchSubmit();
              setMobileSearchOpen(false);
            }}
          >
            Search
          </Button>
        </Box>
      )}

      {/* Profile menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
      >
        <MenuItem component={Link} href="/profile" onClick={handleProfileClose}>
          My Account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>

      {/* Auth Modals */}
      <SignupModal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />

      {/* Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={closeAlert}
          severity={alert.status}
          sx={{ width: "100%" }}
        >
          {alert?.message?.messageEn || alert?.message?.messageKh}
        </Alert>
      </Snackbar>
    </>
  );
}
