"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button  
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs from 'dayjs';

import Select from "@mui/material/Select";
import { House } from "@mui/icons-material";

import Loading from "@/components/Loading";
import RecommendationTable from "@/components/customer/RecommendationTable";
import RecommendData from "@/Json/data.json"


const drawerWidth = 300;
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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
      marginLeft: '300px',
    }),
  })
);

export default function Profile({ params }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const theme = useTheme();
  const [modalDateIsOpen, setModalDateIsOpen] = useState(false)
  const [clickedInput, setClickedInput] = useState(null);
  const [excelData, setExcelData] = React.useState([]);
  const [date, setDate] = React.useState(dayjs());
  const [data, setData] = React.useState([]);
  const [currentData, setCurrentData] = React.useState();
  const [rangeType, setRangeType] = React.useState('day');
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(true);
  const [page, setPage] = React.useState("home");

  useEffect(() => {
    fetchData();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDatePicker = (e) => {
    setClickedInput(e.target.id)
    setModalDateIsOpen(true)
  }

  const dateRangeChange = (event) => {
    setRangeType(event.target.value);
  };

  // File Input
  const handleFileChange = async (event) => {
    const uploadedFiles = event.target.files;
    let averageData = [];

    const processFile = (file) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target.result;
        const rows = fileContent.split('\n');
        if(customer.sex == 'Male') {
          if(rows.length !== 1485) {
            toast.error("Uploaded File is not correct");
            return;
          }
        }
        else if(rows.length !== 1484) {
          toast.error("Uploaded File is not correct");
          return;
        }
        setLoading(true);
        RecommendData.forEach(element => {
          if(customer.sex == 'Male' && element.index > 127) {
            averageData.push(rows[element.index + 2]);
          } else {
            averageData.push(rows[element.index + 1]);
          }
        });
        const formData = {
          customer_id: params.id,
          data: averageData.join(','),
          date: date.format('YYYY-MM-DD')
        };
        try {
          const response = await axios.post(`${API_URL}customer/data/save`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
          setLoading(false);
          var found = false;
          var tmp = data;
          formData.id = response.data;
          if(response.data > data[data.length-1].id) {
            toast.success("Created successfully");
            tmp.push(formData);
          } else {
            toast.success("Updated successfully");
            tmp[response.data].data = formData.data;
          }
          setData(tmp);
          setCurrentData(formData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
      };

      reader.readAsText(file);
    };

    // Process each uploaded file
    for (let i = 0; i < uploadedFiles.length; i++) {
      processFile(uploadedFiles[i]);
    }
  };
  const fetchData = async () => {
    const formData = {
      id: params.id,
    };
    try {
        const response = await axios.post(`${API_URL}customer`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
        setCustomer(response.data[0][0]);
        setData(response.data[1]);
        response.data[1].forEach(element => {
          if(date.format('YYYY-MM-DD') == dayjs(element.date).format('YYYY-MM-DD')) {
            setCurrentData(element);
          }
        });
        setLoading(false);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    var found = false;
    data.forEach(element => {
      if(date.format('YYYY-MM-DD') == dayjs(element.date).format('YYYY-MM-DD')) {
        setCurrentData(element);
        found = true;
      }
    });
    if(found == false) {
      setCurrentData(null);
    }
  }, [date]);
  React.useEffect(() => {
    if(rangeType === 'week') {
      const endDate = dayjs();
      const startDate = endDate.subtract(7, 'day');
      var tmp1 = [];
      var tmp2 = [];
      var tmpAverage1;
      var found = 0;
      data.forEach(element => {
        tmpAverage1 = element;
        const selectedDate = dayjs(element.date);
        if(selectedDate.isBetween(startDate, endDate)) {
          element.data.split(',').forEach((subElement, subIndex) => {
            if(found == 0) {
              tmp1.push(parseFloat(subElement.split(';')[2]));
              tmp2.push(parseFloat(subElement.split(';')[3]));
            } else {
              tmp1[subIndex] += parseFloat(subElement.split(';')[2]);
              tmp2[subIndex] += parseFloat(subElement.split(';')[3]);
            }
          });
          found++;
        }
      });
      var tmpAverage2 = [];
      tmpAverage1.data.split(',').forEach((element, index) => {
        var tmp = element.split(';');
        tmp[2] = parseFloat((tmp1[index]/found).toFixed(2));
        tmp[3] = parseFloat((tmp2[index]/found).toFixed(2));
        tmpAverage2.push(tmp.join(';'));
      });
      setCurrentData({data: tmpAverage2.join(',')});
    }
    if(rangeType === 'month') {
      const endDate = dayjs();
      const startDate = endDate.subtract(30, 'day');
      var tmp1 = [];
      var tmp2 = [];
      var tmpAverage1;
      var found = 0;
      data.forEach(element => {
        tmpAverage1 = element;
        const selectedDate = dayjs(element.date);
        if(selectedDate.isBetween(startDate, endDate)) {
          element.data.split(',').forEach((subElement, subIndex) => {
            if(found == 0) {
              tmp1.push(parseFloat(subElement.split(';')[2]));
              tmp2.push(parseFloat(subElement.split(';')[3]));
            } else {
              tmp1[subIndex] += parseFloat(subElement.split(';')[2]);
              tmp2[subIndex] += parseFloat(subElement.split(';')[3]);
            }
          });
          found++;
        }
      });
      var tmpAverage2 = [];
      tmpAverage1.data.split(',').forEach((element, index) => {
        var tmp = element.split(';');
        tmp[2] = parseFloat((tmp1[index]/found).toFixed(2));
        tmp[3] = parseFloat((tmp2[index]/found).toFixed(2));
        tmpAverage2.push(tmp.join(';'));
      });
      setCurrentData({data: tmpAverage2.join(',')});
    }
    if(rangeType === 'day') {
      data.forEach(element => {
        if(date.format('YYYY-MM-DD') == dayjs(element.date).format('YYYY-MM-DD')) {
          setCurrentData(element);
          found = true;
        }
      });
      if(found == false) {
        setCurrentData(null);
      }
    }
  }, [rangeType]);

  return (
    <Box>
      {loading == false ? (
        <Box>
            <Sidebar
                open={open}
                handleDrawerClose={handleDrawerOpen}
                theme={theme}
                customer={customer}
                page={page}
                setPage={setPage}
            />
            <Main open={open}>
         
              <Box
                sx={{
                  mt: 3,
                  px: 3,
                }}
              >
                <Container className="container">
                  {
                      page === 'home' && (
                          <>
                            <Typography
                              textAlign='center'
                              sx={{ fontWeight: "bold", color: "black" }}
                              variant={"h5"}
                            >
                              Recommendation Dashboard
                            </Typography>
                            <Box mt={6} pb={4} display='flex' alignItems='center' justifyContent='space-between'>
                              <Box display='flex'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            label="Date picker"
                                            value={date}
                                            disabled={rangeType != 'day'}
                                            onChange={(newValue) => setDate(newValue)}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                                <FormControl sx={{mt: '.5rem', ml: '1rem', width: '10rem'}}>
                                  <InputLabel id="demo-simple-select-label">Select Range</InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Select Date Range"
                                    value={rangeType}
                                    onChange={dateRangeChange}
                                  >
                                    <MenuItem value="day" selected>
                                      One Day
                                    </MenuItem>
                                    <MenuItem value="week">Last Week</MenuItem>
                                    <MenuItem value="month">Last Month</MenuItem>
                                  </Select>
                                </FormControl>
                              </Box>
                              <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                disabled={rangeType != 'day'}
                                startIcon={<CloudUploadIcon />}
                              >
                                Upload file
                                <VisuallyHiddenInput type="file" onChange={handleFileChange} accept=".csv, .xlsx"/>
                              </Button>
                            </Box>
                            {
                              currentData === null ? 
                                <>
                                  <Typography
                                    align="center"
                                    variant={"h5"}
                                    mt={4}
                                  >
                                    There is no data to display
                                  </Typography>
                                </> : <RecommendationTable data={currentData?.data}/>
                            }
                          </>
                      )
                  }
                </Container>
              </Box>
            </Main>
        </Box>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
const Sidebar = ({
    open,
    theme,
    page,
    setPage,
    customer
  }) => {
    const buttons = [
        {
          name: "Recommendations",
          icon: House,
          onClick: () => setPage("home"),
          active: page === "home"
        }
      ] ;
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
            {customer.firstname} {customer.lastname}
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
  