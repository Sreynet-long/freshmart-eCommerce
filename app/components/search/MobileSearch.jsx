"use client";

import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function MobileSearch({
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
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search…"
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
