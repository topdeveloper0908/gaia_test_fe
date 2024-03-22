
"use client";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { IconButton, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';


export default function Dashboard({
  data
}) {

    const  colors = ["#ff6d86", "#ff5050", "#97ff3a", "yellow", "#fbc155", "#fff"];
    
    const [current, setCurrent] = useState(0);
    const [tableData, setTableData] = useState(null);
    
    var rows = [];
    data.forEach((element, index) => {
        rows.push({
            id: index,
            date: element.date
        })
    });
    const VirtuosoTableComponents = {
        Scroller: React.forwardRef((props, ref) => (
          <TableContainer component={Paper} {...props} ref={ref} />
        )),
        Table: (props) => (
          <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
        ),
        TableHead,
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
        TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    };

    function fixedHeaderContent1() {
        return (
          <TableRow>
              <TableCell
                key='date'
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                Date
              </TableCell>
          </TableRow>
        );
    }
    function rowContent1(_index, row) {
        return (
          <React.Fragment>
              <TableCell
                key='date'
                align='left'
                onClick={() => setCurrent(_index)}
                className="hover-cursor"
                sx={{
                    backgroundColor: _index == current ? "primary.main" : 'white',
                    color: _index == current ? "white" : '#333',
                    fontWeight: '600'
                }}
              >
                {row['date']}
              </TableCell>
          </React.Fragment>
        );
    }

    function fixedHeaderContent2() {
        return (
          <TableRow>
              <TableCell
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                Category
              </TableCell>
              <TableCell
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                Sub-Category
              </TableCell>
              <TableCell
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                Value
              </TableCell>
              <TableCell
                variant="head"
                align='center'
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                Sub Value
              </TableCell>
          </TableRow>
        );
    }
    function rowContent2(_index, row) {
        return (
          <React.Fragment>
              <TableCell
                align='center'
                sx={{
                    fontWeight: '600'
                }}
              >
                {row[0]}
              </TableCell>
              <TableCell
                align='center'
                sx={{
                    fontWeight: '600'
                }}
              >
                {row[1]}
              </TableCell>
              <TableCell
                align='center'
                sx={{
                    backgroundColor: colors[(Math.floor(row[2] === '' ? 6 : (row[2]/2 === 5 ? 4 : row[2]/2)))],
                    fontWeight: '600'
                }}
              >
                {row[2]}
              </TableCell>
              <TableCell
                align='center'
                sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontWeight: '600'
                }}
              >
                {row[3]}
              </TableCell>
          </React.Fragment>
        );
    }

    useEffect(()=>{
        selectData();
    }, [current])

    const selectData = () => {
        if(data[current]) {
            var tmpTableData = [];
            var tmp = data[current].data.split(',');
            tmp.forEach((element, index) => {
                if(index == 24) {
                    let newStr = element.slice(1);
                    newStr += ';' + tmp[25];
                    tmpTableData.push(newStr.split(';'));
                }
                else if(index != 25) {
                    if(index == 1 || index == 9) {
                        tmpTableData.push(['', element.split(';')[1], '', element.split(';')[2]]);
                    } else {
                        tmpTableData.push(element.split(';'));
                    }
                }
            });
            setTableData(tmpTableData);
        }
    }

    return (
        <>
            <Stack direction='row' mt={-7.5} mb={4} spacing={4}>
                <Box display='flex' alignItems='center'>
                    <Box sx={{width: '6rem', height: '1.5rem', background: colors[0], mr: '.5rem', borderRadius: '.2rem'}}></Box>
                    <span>Very Low</span>
                </Box>
                <Box display='flex' alignItems='center'>
                    <Box sx={{width: '6rem', height: '1.5rem', background: colors[1], mr: '.5rem', borderRadius: '.2rem'}}></Box>
                    <span>Low</span>
                </Box>
                <Box display='flex' alignItems='center'>
                    <Box sx={{width: '6rem', height: '1.5rem', background: colors[2], mr: '.5rem', borderRadius: '.2rem'}}></Box>
                    <span>Normal</span>
                </Box>
                <Box display='flex' alignItems='center'>
                    <Box sx={{width: '6rem', height: '1.5rem', background: colors[3], mr: '.5rem', borderRadius: '.2rem'}}></Box>
                    <span>Increased</span>
                </Box>
                <Box display='flex' alignItems='center'>
                    <Box sx={{width: '6rem', height: '1.5rem', background: colors[4], mr: '.5rem', borderRadius: '.2rem'}}></Box>
                    <span>High</span>
                </Box>
            </Stack>
            <Grid
                container
                spacing={4}
                justifyContent={"center"}
            >
                <Grid item md={3} display={"flex"} flexDirection={"column"}>
                    <Paper style={{ height: 700, width: '100%' }}>
                        <TableVirtuoso
                            data={rows}
                            components={VirtuosoTableComponents}
                            fixedHeaderContent={fixedHeaderContent1}
                            itemContent={rowContent1}
                        />
                    </Paper>
                </Grid>
                <Grid item md={9} display={"flex"} flexDirection={"column"}>
                    <Paper style={{ height: 700, width: '100%' }}>
                        <TableVirtuoso
                            data={tableData}
                            components={VirtuosoTableComponents}
                            fixedHeaderContent={fixedHeaderContent2}
                            itemContent={rowContent2}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
