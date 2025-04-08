"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  TablePagination,
  TextField,
} from "@mui/material";
import { CheckCircle, Cancel, Visibility, Refresh } from "@mui/icons-material";
import axios from "axios";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

const AdminOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const token = sessionStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(data || []); // Ensure we always have an array
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Failed to fetch orders", { variant: "error" });
      setLoading(false);
      setOrders([]); // Set to empty array on error
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `/api/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      enqueueSnackbar(`Order marked as ${status}`, { variant: "success" });
      fetchOrders();
    } catch (error) {
      enqueueSnackbar("Failed to update order status", { variant: "error" });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredOrders = orders.filter((order) => {
    if (!order || !order.user) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      order._id?.toLowerCase().includes(searchLower) ||
      order.user.name?.toLowerCase().includes(searchLower) ||
      order.user.email?.toLowerCase().includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower)
    );
  });

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredOrders.length - page * rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "rejected":
        return "error";
      case "processing":
        return "warning";
      case "shipped":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          Orders Management
        </Typography>
        <Box>
          <TextField
            label="Search Orders"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchOrders}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        #{order._id?.substring(0, 8)}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.user?.name || "N/A"}</TableCell>
                    <TableCell>{order.user?.email || "N/A"}</TableCell>
                    <TableCell>
                      {order.createdAt
                        ? format(
                            new Date(order.createdAt),
                            "MMM dd, yyyy HH:mm"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>{(order.items || []).length}</TableCell>
                    <TableCell>
                      ${order.totalPrice?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status || "unknown"}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              router.push(`/orderdetails/${order._id}`)
                            }
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark as Completed">
                          <IconButton
                            color="success"
                            onClick={() =>
                              handleUpdateStatus(order._id, "completed")
                            }
                            disabled={order.status === "completed"}
                          >
                            <CheckCircle fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Order">
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleUpdateStatus(order._id, "rejected")
                            }
                            disabled={order.status === "rejected"}
                          >
                            <Cancel fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            )}
            {emptyRows > 0 && !loading && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={8} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AdminOrdersTable;
