"use client";
import React, { use, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import CustomMultiSelect from "@/components/Multiselect";
import axios from "axios";

export default function AddCustomer() {

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const [countries, setCountries] = useState([]);
useEffect(() => {
    axios
      .get("https://trial.mobiscroll.com/content/countries.json")
      .then((res) => {
        const data = res.data;
        data.push({ value: "CA", text: "Canada", group: "C" });
        data.sort((a, b) => a.text.localeCompare(b.text));
        setCountries(data);
      });
    axios.get(`${API_URL}metadata`).then((res) => {
      setSpecialtyOptions(res.data.specs);
      setTagsOptions(res.data.tags);
    });
}, []);

  return (
    <Grid
      container
      spacing={4}
      justifyContent={"center"}
      component={"form"}
    >
      <Grid item md={6} gap={4} display={"flex"} flexDirection={"column"}>
        <Stack direction="row" spacing={2} justifyContent={"center"}>
          <TextField
            size="small"
            margin="normal"
            fullWidth
            id="firstname"
            label="First Name"
            name="firstname"
            autoComplete="firstname"
            autoFocus
            type="text"
          />
          <TextField
            size="small"
            margin="normal"
            fullWidth
            id="lastname"
            label="Last Name"
            name="lastname"
            autoComplete="lastname"
            autoFocus
            type="text"
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent={"center"}>
          <TextField
            size="small"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            type="email"
          
          />
          <TextField
            size="small"
            margin="normal"
            fullWidth
            id="phone"
            label="Phone"
            name="phone"
            autoComplete="phone"
            autoFocus
            type="text"
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent={"center"}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sex</InputLabel>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Sex"
              name="sex"
             
            >
              <MenuItem value="Male" selected>
                Male
              </MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Grid>
      <Grid item md={6} gap={4} display={"flex"} flexDirection={"column"}>
        <Stack>
          <TextField
            size="small"
            fullWidth
            id="address"
            label="Address"
            name="address"
            autoComplete="address"
            autoFocus
            type="text"
           
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent={"center"}>
          <TextField
            size="small"
            fullWidth
            id="city"
            label="City"
            name="city"
            autoComplete="city"
            autoFocus
            type="text"
       
          />
          <TextField
            size="small"
            fullWidth
            id="state"
            label="State"
            name="state"
            autoComplete="state"
            autoFocus
            type="text"
          
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            fullWidth
            id="zipcode"
            label="Zipcode"
            name="zipcode"
            autoComplete="zipcode"
            autoFocus
            type="text"
            
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              size="small"
              fullWidth
              id="country"
              label="Country"
              name="country"
              autoComplete="country"
              placeholder="Select Country"
              autoFocus
              type="text"
              
            >
              {countries.map((country) => (
                <MenuItem value={country.value} key={country.value}>
                  {country.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          <TextField
            size="small"
            id="description"
            label="Description"
            name="description"
            type="text"
            sx={{
              visibility: "hidden",
            }}
          />
        </Stack>
      </Grid>
      <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
        <Button
          type="submit"
          variant="contained"
          sx={{ m: 4, py: 2, px: 4 }}
          size="large"
        >
          Add
        </Button>
      </Box>
    </Grid>
  );
}

export function SelectModal({
  open,
  handleClose,
  style,
  selected,
  setSelected,
  type,
  options,
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      sx={{
        color: "black",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 1,
          boxShadow: 24,
          width: 450,
        }}
      >
        <h3
          id="parent-modal-title"
          style={{
            padding: "20px",
          }}
        >
          Select {type}
        </h3>
        <Divider component={"div"} fullWidth />

        <Box
          style={{
            padding: "15px",
          }}
        >
          <CustomMultiSelect
            selected={selected}
            setSelected={setSelected}
            type={type}
            options={options}
          />
        </Box>

        <Divider component={"div"} fullWidth />
        <Stack direction="row" spacing={1} justifyContent={"center"} py={2}>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setSelected([]);
              handleClose();
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
