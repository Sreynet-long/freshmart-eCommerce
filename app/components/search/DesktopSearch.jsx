"use client";

import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function DesktopSearch({
  options,
  searchText,
  setSearchText,
  debouncedSearch,
}) {
  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => option.label || ""}
      inputValue={searchText}
      onInputChange={(event, newValue) => {
        setSearchText(newValue);
        debouncedSearch(newValue);
      }}
      sx={{ flex: 1 }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search products..."
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "green" }} />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
