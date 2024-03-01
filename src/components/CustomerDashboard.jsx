"use client";
import React, { use, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useFormik } from "formik";
import * as Yup from "yup";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Avatar, Button, Stack } from "@mui/material";
import { Add, House, Logout } from "@mui/icons-material";
import AddAPIModal from "@/components/modal/AddAPIModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import APITable from "@/components/APITable";
import axios from "axios";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import { API_URL } from "@/constants/constants";
import { toast } from "react-toastify";

const drawerWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

export default function CustomerDashboard() {
  const theme = useTheme();
  const token = Cookies.get("token");
  const [openAddAPIModal, setAddAPIModal] = React.useState(false);
  const [openEditAPIModal, setEditAPIModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [countries, setCountries] = useState([]);
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState("home");
  const [customerProfile, setCustomerProfile] = React.useState({});
  const [apiData, setApiData] = React.useState([]);
  const [deleteAPI, setDeleteAPI] = React.useState({});
  const [editAPI, setEditAPI] = React.useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDeleteModal = (user) => {
    setDeleteAPI(user);
    setOpenDeleteModal(true);
  };

  const handleEditModal = (user) => {
    setEditAPI(user);
    setEditAPIModal(true);
  };

  React.useEffect(() => {
    getCountries();
    getCustomer();
    getAPIData();
    getMainData();
  }, []);

  // yup
  const validationSchema = Yup.object().shape({
    firstname: Yup.string(),
    lastname: Yup.string(),
    email: Yup.string(),
    phone: Yup.string(),
    sex: Yup.string(),
    address: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipcode: Yup.string(),
    country: Yup.string(),
    password: Yup.string()
  });

  const handleSubmit = async (newuser) => {
    setIsSubmitting(true);
    await axios
      .post(`${API_URL}customer/update`, newuser, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        toast.success(
          `Profile updated successfully`
        );
        setCustomerProfile(newuser);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update user");
      });
    setIsSubmitting(false);
  };

  const handleSaveIntegration = async (data) => {
    setIsSubmitting(true);
    await axios
      .post(`${API_URL}customer/api/new`, data, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        toast.success(
          `API added successfully`
        );
        var tmp = {};
        if(data.type === 'heartCloud') {
          tmp.id = res.data.id,
          tmp.apiType = data.type,
          tmp.name = 'Heart Cloud',
          tmp.url = 'https://heartCloud.io',
          tmp.parameters = ['Client ID', 'Client Secret'],
          tmp.credentials = [data.h_id, data.h_secret]
        }
        setApiData([...apiData, tmp]);
        setAddAPIModal(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update user");
      });
    setIsSubmitting(false);
  };

  const handleUpdateIntegration = async (data) => {
    setIsSubmitting(true);
    await axios
      .post(`${API_URL}customer/api/update`, data)
      .then((res) => {
        toast.success(
          `API updated successfully`
        );
        if(data.apiType === 'heartCloud') {
          let newData = apiData;
          newData.forEach(element => {
            if(element.apiType == data.apiType) {
              element.credentials = [data.h_id, data.h_secret];
            }
          });
          setApiData(newData);
        }
        setEditAPIModal(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update user");
      });
    setIsSubmitting(false);
  };

  const formik = useFormik({
    initialValues: customerProfile,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const getCountries = async () => {
    await axios
      .get("https://trial.mobiscroll.com/content/countries.json")
      .then((res) => {
        const data = res.data;
        data.push({ value: "CA", text: "Canada", group: "C" });
        data.sort((a, b) => a.text.localeCompare(b.text));
        setCountries(data);
      });
  }

  const getCustomer = async () => {
    await axios
      .get(`${API_URL}customer`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setCustomerProfile(res.data[0]);
        if(res.data[0].apis !== null) {
          var tmp = [];
          res.data[0]?.apis.forEach((element, index) => {
            tmp.push({name: element, key: res.data[0]?.credentials[index]})
          });
          setApiData(tmp);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          window.location.href = "/customer/login";
        }
        console.log(err);
      });
    setLoading(false);
  };

  const getAPIData = async () => {
    await axios
      .get(`${API_URL}customer/api`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        var tmp = [];
        res.data.forEach(element => {
          if(element.type === 'heartCloud') {
            tmp.push({
              id: element.id,
              name: 'Heart Cloud',
              apiType: element.type,
              url: 'https://heartCloud.io',
              parameters: ['Client ID', 'Client Secret'],
              credentials: element.credentials.split(',')
            })
          }
        });
        setApiData(tmp);
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          window.location.href = "/customer/login";
        }
        console.log(err);
      });
    setLoading(false);
  };

  const getMainData = async () => {
    console.log('aaa');
    await axios
      .get(`${API_URL}customer/api/data`)
      .then((res) => {
        console.log('data', res.data);
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          window.location.href = "/customer/login";
        }
        console.log(err);
      });
    setLoading(false);
  };

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDeleteAPI = async (user) => {
    setIsDeleting(true);
    await axios
      .post(
        `${API_URL}customer/api/remove`,
        {
          id: user,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        toast.success("API deleted successfully");
        setOpenDeleteModal(false);
        // set new data
        let newData = apiData.filter((api) => api.id != user);
        setApiData(newData);
        setOpenDeleteModal(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete user");
      });
    setIsDeleting(false);
  };

  useEffect(() => {
    formik.setValues({...customerProfile, password: ''});
    if (customerProfile?.country?.length > 2) {
        formik.setFieldValue(
            "country",
            countries.find((c) => c.text === customerProfile.country).value
        );
    }
  }, [customerProfile]);

  
  return loading ? (
    <Loading />
  ) : (
    <Box sx={{ display: "flex" }}>
      {(
        <>
          <AddAPIModal
            open={openAddAPIModal}
            handleConfirm={handleSaveIntegration}
            handleClose={() => setAddAPIModal(false)}
            isSubmitting={isSubmitting}
          />
          <AddAPIModal
            open={openEditAPIModal}
            handleConfirm={handleUpdateIntegration}
            handleClose={() => setEditAPIModal(false)}
            isSubmitting={isSubmitting}
            data={editAPI}
          />
          <ConfirmDeleteModal
            open={openDeleteModal}
            handleConfirm={handleDeleteAPI}
            handleClose={() => setOpenDeleteModal(false)}
            isDeleting={isDeleting}
            user={deleteAPI}
          />
        </>
      )}
      <Sidebar
        open={open}
        handleDrawerClose={handleDrawerOpen}
        theme={theme}
        setPage={setPage}
        page={page}
        customerProfile={customerProfile}
      />
      <Main open={open}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            p: 1,
            backgroundColor: "#237EEE",
            color: "white",
            ":hover": {
              backgroundColor: "#237EEE",
            },
            borderRadius: "7px",
          }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Box
          sx={{
            mt: 3,
            px: 3,
          }}
        >
          {
            page === 'home' && (
              <>
                  <Stack direction="row" justifyContent={"center"} mb={11}>
                      <Typography
                          sx={{ fontWeight: "bold", color: "black" }}
                          variant={"h5"}
                      >
                          Edit Profile
                      </Typography>
                  </Stack>
                  <Grid
                      container
                      spacing={4}
                      justifyContent={"center"}
                      component={"form"}
                      onSubmit={formik.handleSubmit}
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
                              required
                              onChange={formik.handleChange}
                              value={formik.values.email}
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
                              required
                              onChange={formik.handleChange}
                              value={formik.values.phone}
                          />
                          </Stack>
                          <Stack direction="row" spacing={2} justifyContent={"center"}>
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
                              required
                              onChange={formik.handleChange}
                              value={formik.values.password}
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
                                  onChange={formik.handleChange}
                                  value={formik.values.sex ? formik.values.sex : ""}
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
                              onChange={formik.handleChange}
                              value={formik.values.address}
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
                              onChange={formik.handleChange}
                              value={formik.values.city}
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
                              onChange={formik.handleChange}
                              value={formik.values.state}
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
                              onChange={formik.handleChange}
                              value={formik.values.zipcode}
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
                              onChange={formik.handleChange}
                              value={formik.values.country ? formik.values.country : ""}
                              >
                              {countries.map((country) => (
                                  <MenuItem value={country.value} key={country.value}>
                                  {country.text}
                                  </MenuItem>
                              ))}
                              </Select>
                          </FormControl>
                          </Stack>
                      </Grid>
                      <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                          <Button
                          type="submit"
                          variant="contained"
                          sx={{ m: 4, py: 2, px: 4 }}
                          disabled={!formik.isValid || isSubmitting}
                          size="large"
                          >
                          {isSubmitting ? "Submitting..." : "Update"}
                          </Button>
                      </Box>
                  </Grid>
              </>
            )
          }
          {
            page === 'integration' && (
              <Box sx={{ my: 2 }}>
                <Stack direction="row" justifyContent={"space-between"}>
                <h3>API List</h3>

                  <Button
                    variant="contained"
                    co="correctValue"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setAddAPIModal(true);
                    }}
                  >
                    <span className="text">Add Integration</span>
                  </Button>
                </Stack>
                <APITable
                  handleDeleteModal={handleDeleteModal}
                  handleEditModal={handleEditModal}
                  data={apiData}
                />
              </Box>
            )
          }
        </Box>
      </Main>
    </Box>
  );
}

const Sidebar = ({
  open,
  handleDrawerClose,
  theme,
  setPage,
  page,
  customerProfile
}) => {
  const buttons = [
    {
        name: "Home",
        icon: House,
        onClick: () => setPage("home"),
        active: page === "home",
    },
    {
      name: "API Integrations",
      icon: House,
      onClick: () => setPage("integration"),
      active: page === "integration",
    },
    {
      name: "Dashboard",
      icon: House,
      onClick: () => setPage("dashboard"),
      active: page === "dashboard",
    },
    {
      name: "Recommendations",
      icon: House,
      onClick: () => setPage("recommendations"),
      active: page === "recommendations",
    },
    {
      name: "Nutrition",
      icon: House,
      onClick: () => setPage("nutrition"),
      active: page === "nutrition",
    },
    {
      name: "Essential Oils",
      icon: House,
      onClick: () => setPage("essentialOils"),
      active: page === "essentialOils",
    },
    {
      name: "Crystals",
      icon: House,
      onClick: () => setPage("crystals"),
      active: page === "crystals",
    },
    {
      name: "LifeStyle",
      icon: House,
      onClick: () => setPage("lifestyle"),
      active: page === "lifestyle",
    },
    {
      name: "Psycho Emotional",
      icon: House,
      onClick: () => setPage("psychoEmotional"),
      active: page === "psychoEmotional",
    },
    {
      name: "Physical",
      icon: House,
      onClick: () => setPage("physical"),
      active: page === "physical",
    },
    {
        name: "Sign out",
        icon: Logout,
        onClick: () => {
          Cookies.remove("token");
          window.location.href = "/customer/login";
        },
    },
  ];
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#32373d",
          color: "white",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          backgroundColor: "#24262A",
          p: 5,
          pt: 9,
        }}
      >
        <Typography
          variant="h1"
          color="white"
          sx={{
            fontSize: "1.1em",
            fontWeight: "500",
            color: "white",
          }}
        >
          {customerProfile?.firstname + ' ' + customerProfile?.lastname}
        </Typography>
      </Box>
      <List
        sx={{
          p: 0,
        }}
      >
        {buttons.map((btn, index) => (
          <ListItem key={btn.name} disablePadding>
            <ListItemButton
              sx={{
                py: 1.5,
                ":hover": {
                  backgroundColor: "dodgerblue",
                },
                justifyContent: "flex-start",
                borderBottom: "1px solid #F0F7FF16",
                backgroundColor: btn.active ? "#237EEE" : "transparent",
              }}
              onClick={btn.onClick}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <btn.icon />
              </ListItemIcon>
              <ListItemText primary={btn.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
