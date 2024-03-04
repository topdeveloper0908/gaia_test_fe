"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Avatar, Button, Stack } from "@mui/material";
import { Add, House, Logout, User } from "@mui/icons-material";
import CustomTable from "@/components/CustomTable";
import axios from "axios";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import { API_URL } from "@/constants/constants";
import { toast } from "react-toastify";
import EditModal from "@/components/EditModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import * as XLSX from "xlsx";
import AddPractitioner from "@/components/AddPractitioener";
import AddCustomer from "@/components/AddCustomer";
import UploadModal from "./UploadModal";

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

export default function Dashboard({ isUser, isCustomer }) {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [dataTmp, setDataTmp] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [userProfile, setuserProfile] = React.useState({});
  const token = Cookies.get("token");
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [editUser, setEditUser] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deleteUser, setDeleteUser] = React.useState({});
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [page, setPage] = React.useState("home");

  const [openUploadModal, setOpenUploadModal] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [replace, setReplace] = React.useState(false);

  const handleEditModal = (user) => {
    setEditUser(user);
    setOpenEditModal(true);
  };

  const handleDeleteModal = (user) => {
    setDeleteUser(user);
    setOpenDeleteModal(true);
  };

  function handleUpload(e) {
    try {
      if (!file) {
        toast.error("Please select a file");
        return;
      }
      setIsUploading(true);
      var reader = new FileReader();
      var excelCheck = true;
      var excelTypes = {
        TYPE1: "1",
        TYPE2: "2",
      };
      var excelType = "";
      var excelTemplate = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Address",
        "City",
        "State",
        "Zipcode",
        "Country",
        "ImageURL",
        "Specialty",
        "Tags",
        "MeetingLink",
        "Sex",
      ];
      var excelTemplate2 = [
        // Customer ID,First Name,Last Name,Email,Accepts Email Marketing,Company,Address1,Address2,City,Province,Province Code,Country,Country Code,Zip,Phone,Accepts SMS Marketing,Total Spent,Total Orders,Tags,Note,Tax Exempt
        "Customer ID",
        "First Name",
        "Last Name",
        "Email",
        "Accepts Email Marketing",
        "Company",
        "Address1",
        "Address2",
        "City",
        "Province",
        "Province Code",
        "Country",
        "Country Code",
        "Zip",
        "Phone",
        "Accepts SMS Marketing",
        "Total Spent",
        "Total Orders",
        "Tags",
        "Note",
        "Tax Exempt",
      ];
      reader.onload = async function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var sheetName = workbook.SheetNames[0];
        var sheet = workbook.Sheets[sheetName];
        var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // excelTemplate.forEach((element, index) => {
        //   if (element != jsonData[0][index]) {
        //     excelCheck = false;
        //   }
        // });
        if (
          jsonData[0].length == 21 &&
          jsonData[0].every((value, index) => value === excelTemplate2[index])
        ) {
          excelCheck = true;
          excelType = excelTypes.TYPE2;
        } else if (
          jsonData[0].length == 14 &&
          jsonData[0].every((value, index) => value === excelTemplate[index])
        ) {
          excelCheck = true;
          excelType = excelTypes.TYPE1;
        } else {
          excelCheck = false;
        }
        if (excelCheck == false) {
          toast.error("Invalid Excel Template");
          return;
        } else {
          var objectData = jsonData.map((row) => {
            var obj = {};
            jsonData[0].forEach((key, i) => (obj[key] = row[i]));
            return obj;
          });
          if (excelType == excelTypes.TYPE2) {
            objectData = objectData.map((row) => {
              return {
                "First Name": row["First Name"],
                "Last Name": row["Last Name"],
                Email: row["Email"],
                Phone: row["Phone"],
                Address: row["Address1"],
                City: row["City"],
                State: row["Province"],
                Zipcode: row["Zip"],
                Country: row["Country"],
                ImageURL: "",
                Specialty: "",
                Tags: row["Tags"],
                MeetingLink: "",
              };
            });
          }
          const response = await axios.post(`${API_URL}updateDB`, {
            data: objectData,
            replace: replace,
          });
          const result = response.data;
          if (result == "success") {
            toast.success("Data uploaded successfully");
            setOpenUploadModal(false);

            getData();
          }
        }
        setIsUploading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.log(error);
      setIsUploading(false);
    }
  }

  const handleSaveUser = async (newuser) => {
    setIsSubmitting(true);
    await axios
      .post(`${API_URL}update`, newuser, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        toast.success(
          `${isUser ? "Profile" : "Practitioner"} updated successfully`
        );
        if (!isUser) {
          setOpenEditModal(false);
          // set new data
          let newData = data.map((user) => {
            if (user.id == newuser.id) {
              return newuser;
            }
            return user;
          });
          setData(newData);
          setDataTmp(newData);
          setOpenEditModal(false);
        } else {
          setuserProfile(newuser);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update user");
      });
    setIsSubmitting(false);
  };

  const handleDeleteUser = async (userId) => {
    setIsDeleting(true);
    await axios
      .post(
        `${API_URL}remove`,
        {
          id: userId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        toast.success("User deleted successfully");
        setOpenDeleteModal(false);
        // set new data
        let newData = data.filter((user) => user.id != userId);
        setData(newData);
        setDataTmp(newData);
        setOpenDeleteModal(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete user");
      });
    setIsDeleting(false);
  };

  const getData = async () => {
    await axios
      .get(`${API_URL}all`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        console.log('res', res.data);
        setData(res.data);
        setDataTmp(res.data);
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          window.location.href = "/login";
        }
        console.log(err);
      });
    setLoading(false);
  };

  const getUser = async () => {
    await axios
      .get(`${API_URL}user`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setuserProfile(res.data[0]);
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          window.location.href = "/login";
        }
        console.log(err);
      });
    setLoading(false);
  };

  React.useEffect(() => {
    !isUser ? getData() : getUser();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  function addPractitioner(practitioner) {
    setData([...data, practitioner]);
    setDataTmp([...dataTmp, practitioner]);
  }

  const searchPractitioner = (event) => {
    setData(dataTmp);
    setSearch(event.target.value)
  }

  React.useEffect(() => {
    if(search === '') {
      return;
    } else {
      var tmp = [];
      data.forEach(element => {
        if( element.firstname.toLowerCase().indexOf(search) > -1 || 
            element.lastname.toLowerCase().indexOf(search) > -1 ||
            element.specialty.toLowerCase().indexOf(search) > -1 || 
            element.tags.toLowerCase().indexOf(search) > -1 ||
            element.city.toLowerCase().indexOf(search) > -1 || 
            element.address.toLowerCase().indexOf(search) > -1) {
          tmp.push(element);
        }
      });
      setData(tmp);
    }
  }, [search]);

  return loading ? (
    <Loading />
  ) : (
    <Box sx={{ display: "flex" }}>
      {!isUser && (
        <>
          <EditModal
            open={openEditModal}
            handleConfirm={handleSaveUser}
            handleClose={() => setOpenEditModal(false)}
            user={editUser}
            setUser={setEditUser}
            isSubmitting={isSubmitting}
          />
          <UploadModal
            open={openUploadModal}
            handleClose={() => setOpenUploadModal(false)}
            isUploading={isUploading}
            handleUpload={handleUpload}
            setFile={setFile}
            setReplace={setReplace}
          />
          <ConfirmDeleteModal
            open={openDeleteModal}
            handleConfirm={handleDeleteUser}
            handleClose={() => setOpenDeleteModal(false)}
            isDeleting={isDeleting}
            user={deleteUser}
          />
        </>
      )}
      <Sidebar
        open={open}
        handleDrawerClose={handleDrawerOpen}
        theme={theme}
        setPage={setPage}
        page={page}
        isUser={isUser}
        isCustomer={isCustomer}
        userProfile={userProfile}
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
          {!isUser && page === "home" ? (
            <>
              <Stack direction="row" justifyContent={"space-between"}>
                <h3>Practitioner List</h3>

                <Stack alignItems={'center'} direction="row">
                  <TextField
                    size="small"
                    fullWidth
                    id="searchWord"
                    label="Search...."
                    name="searchWord"
                    autoComplete="searchWord"
                    autoFocus
                    type="text"
                    onChange={searchPractitioner}
                    value={search}
                  />
                  <Box mr={1}></Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpenUploadModal(true);
                    }}
                    style={{whiteSpace: 'nowrap', width: '10rem'}}
                  >
                    Upload Excel
                  </Button>
                </Stack>
              </Stack>
              <Box sx={{ my: 2 }}>
                <CustomTable
                  data={data}
                  handleEditModal={handleEditModal}
                  handleDeleteModal={handleDeleteModal}
                />
              </Box>
            </>
          ) : (
            <>
              <Stack direction="row" justifyContent={"center"} mb={11}>
                {
                  page === 'addCustomer' ? 
                    <Typography
                      sx={{ fontWeight: "bold", color: "black" }}
                      variant={"h5"}
                    >
                      Add a Customer
                    </Typography> : 
                    <Typography
                      sx={{ fontWeight: "bold", color: "black" }}
                      variant={"h5"}
                    >
                      {isUser ? "Edit Profile" : "Add a Practitioner"}
                    </Typography>
                    
                }
              </Stack>
              <Box sx={{ my: 2 }}>
                {
                  page === 'addCustomer' ?
                  <AddCustomer /> : <AddPractitioner
                      addPractitioner={addPractitioner}
                      userProfile={userProfile}
                      isUser={isUser}
                      handleUpdateProfile={handleSaveUser}
                    />
                }
              </Box>
            </>
          )}
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
  userProfile,
  isUser,
  isCustomer
}) => {
  const buttons = !isUser
    ? ( isCustomer ? [
      {
        name: "Dashboard",
        icon: House,
      },
      {
        name: "Recommendations",
        icon: House,
      },
      {
        name: "Nutrition",
        icon: House,
      },
      {
        name: "Essential Oils",
        icon: House,
      },
      {
        name: "Crystals",
        icon: House,
      },
      {
        name: "LifeStyle",
        icon: House,
      },
      {
        name: "Psycho Emotional",
        icon: House,
      },
      {
        name: "Physical",
        icon: House,
      },
    ] : [
        {
          name: "Home",
          icon: House,
          onClick: () => setPage("home"),
          active: page === "home",
        },
        {
          name: "Add Practitioner",
          icon: Add,
          onClick: () => setPage("add"),
          active: page === "add",
        },
        {
          name: "Sign out",
          icon: Logout,
          onClick: () => {
            Cookies.remove("token");
            window.location.href = "/login";
          },
        },
      ])
    : [
        {
          name: "Home",
          icon: House,
          onClick: () => setPage("home"),
          active: page === "home",
        },
        // {
        //   name: "Add Customer",
        //   icon: Add,
        //   onClick: () => setPage("addCustomer"),
        //   active: page === "addCustomer",
        // },
        {
          name: "Sign out",
          icon: Logout,
          onClick: () => {
            Cookies.remove("token");
            window.location.href = "/login";
          },
        }
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
        {isUser &&
          (userProfile.upload == 0 ? (
            !userProfile.imageURL || userProfile.imageURL == "" ? (
              userProfile.sex == "Male" ? (
                <Avatar
                  src={
                    "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34a0dbca137ef4f425e.png"
                  }
                  sx={{ width: 100, height: 100 }}
                />
              ) : (
                <Avatar
                  src={
                    "https://storage.googleapis.com/msgsndr/WkKl1K5RuZNQ60xR48k6/media/65b5b34ab7ea181193716085.png"
                  }
                  sx={{ width: 100, height: 100 }}
                />
              )
            ) : (
              <Avatar
                src={userProfile.imageURL}
                alt={userProfile.firstname[0]}
                sx={{ width: 100, height: 100 }}
              />
            )
          ) : (
            <Avatar
              src={API_URL + "src/" + userProfile.imageURL}
              alt={userProfile.firstname[0]}
              sx={{ width: 100, height: 100 }}
            />
          ))}
        {!isUser && (
          <Avatar
            alt="Remy Sharp"
            src="https://biohackingcongress.com/storage/users/June2023/9Q67Ebbs5rPLWWmWGZET.png"
            sx={{ width: 100, height: 100 }}
          />
        )}

        <Typography
          variant="h1"
          color="white"
          sx={{
            fontSize: "1.1em",
            fontWeight: "500",
            color: "white",
          }}
        >
          {isUser ? `${userProfile.firstname} ${userProfile.lastname}` : "Administrator"}
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
