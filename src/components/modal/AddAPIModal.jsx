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

export default function AddAPIModal({
  open,
  handleConfirm,
  handleClose,
  isSubmitting,
  data = []
}) {

    console.log(data);
    var initals;
    if(data.length == 0) {
        initals = {apiType: 'heartCloud', h_id: '', h_secret: ''}
    }
    else if (data.apiType === 'heartCloud') {
        initals = {
            apiType: 'heartCloud', 
            h_id: data.credentials[0], 
            h_secret: data.credentials[1]
        }
    }

  const formik = useFormik({
    initialValues: initals,
    onSubmit: (values) => {
      handleConfirm(values);
    },
  });

  useEffect(() => {
    if(data.apiType === 'heartCloud') {
        formik.setValues({
            apiType: 'heartCloud', 
            h_id: data.credentials[0], 
            h_secret: data.credentials[1]
        });
    }
  }, [data]);

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
        >{
            data.length == 0 ? 'Add API Integration' : 'Edit API Integration'
        }
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
          <Stack spacing={2} direction="row">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">API Type</InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="API Type"
                name="apiType"
                onChange={formik.handleChange}
                value={formik.values?.apiType}
              >
                <MenuItem value="heartCloud">Heart Cloud</MenuItem>
                <MenuItem value="biowell">Bio-Well</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          {
            formik.values?.apiType === 'heartCloud' && (
                <Stack direction="row" spacing={2}>
                    <TextField
                        size="small"
                        margin="normal"
                        fullWidth
                        id="h_id"
                        label="Client ID"
                        name="h_id"
                        autoComplete="h_id"
                        autoFocus
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.h_id}
                        required
                    />
                    <TextField
                        size="small"
                        margin="normal"
                        fullWidth
                        id="h_secret"
                        label="Client Secret"
                        name="h_secret"
                        autoComplete="h_secret"
                        autoFocus
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.h_secret}
                        required
                    />
                </Stack>
            )
          }
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
