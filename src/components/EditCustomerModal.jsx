"use client";

import { API_URL } from "@/constants/constants";
import { useFormik } from "formik";
import { use, useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { SelectModal } from "@/app/register/page";

const {
  Modal,
  Box,
  Divider,
  Button,
  Stack,
  TextField,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
} = require("@mui/material");

export default function EditCustomerModal({
  open,
  handleConfirm,
  handleClose,
  isSubmitting,
  user
}) {
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
  }, []);

  const formik = useFormik({
    initialValues: {...user, password: ''},
    onSubmit: (values) => {
      handleConfirm(values);
    },
  });

  useEffect(() => {
    formik.setValues({...user, password: ''});
    if (user?.country?.length > 2) {
      formik.setFieldValue(
        "country",
        countries.find((c) => c.text === user.country).value
      );
    }
  }, [user]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      sx={{
        color: "black",
        py: 10,
        overflow: "scroll",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, 0)",
          bgcolor: "white",
          borderRadius: 1,
          boxShadow: 24,
          width: 500,
        }}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <h3
          id="parent-modal-title"
          style={{
            padding: "20px",
          }}
        >
          Edit Customer
        </h3>
        <Divider component={"div"} fullWidth />
        <Box
          px={4}
          py={3}
          sx={{
            gap: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" spacing={2}>
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
              onChange={formik.handleChange}
              value={formik.values.firstname}
              required
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
              onChange={formik.handleChange}
              value={formik.values.lastname}
              required
            />
          </Stack>
          
          <Stack spacing={2} direction="row">
            <TextField
              size="small"
              margin="normal"
              fullWidth
              id="password"
              label="Password"
              name="password"
              autoComplete="password"
              autoFocus
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              required
            />
            <FormControl
              sx={{
                width: "33%",
              }}
            >
              <InputLabel id="demo-simple-select-label">Sex</InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Sex"
                name="sex"
                onChange={formik.handleChange}
                value={formik.values.sex}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              fullWidth
              id="address"
              label="Address"
              name="address"
              autoComplete="address"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.address}
            />
            <TextField
              size="small"
              fullWidth
              id="city"
              label="City"
              name="city"
              autoComplete="city"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.city}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              id="zipcode"
              label="Zipcode"
              name="zipcode"
              autoComplete="zipcode"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.zipcode}
            />
            <TextField
              size="small"
              id="state"
              label="State"
              name="state"
              autoComplete="state"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.state}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControl
              sx={{
                width: "48%",
              }}
            >
              <InputLabel id="demo-simple-select-label">Country</InputLabel>
              <Select
                size="small"
                margin="normal"
                id="country"
                label="Country"
                name="country"
                autoComplete="country"
                placeholder="Select Country"
                autoFocus
                type="text"
                onChange={formik.handleChange}
                value={formik.values.country}
              >
                {countries.map((country) => (
                  <MenuItem value={country.value} key={country.value}>
                    {country.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.email}
              required
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              id="phone"
              label="Phone"
              name="phone"
              autoComplete="phone"
              autoFocus
              type="text"
              onChange={formik.handleChange}
              value={formik.values.phone}
              required
            />
          </Stack>
        </Box>
        <Divider component={"div"} fullWidth />
        <Stack
          direction="row"
          spacing={1}
          alignItems={"center"}
          justifyContent={"flex-end"}
          p={2}
        >
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!formik.isValid || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
