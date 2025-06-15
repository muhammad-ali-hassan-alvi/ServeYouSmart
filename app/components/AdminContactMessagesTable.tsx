"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  TablePagination,
  TextField,
  Avatar,
} from "@mui/material";
import { Refresh, Delete, Visibility } from "@mui/icons-material";
import axios from "axios";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  // Add other properties if needed
}

// Then update your useState to use this type

const AdminContactMessagesTable = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();


  // useEffect(() => {
  //   fetchMessages();
  // }, []);

  const token = sessionStorage.getItem("token");

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("https://serveyousmartbe-production.up.railway.app/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data || []);
      setLoading(false);
    } catch {
      enqueueSnackbar("Failed to fetch contact messages", { variant: "error" });
      setLoading(false);
      setMessages([]);
    }
  }, [token, enqueueSnackbar]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // const handleMarkAsRead = async (messageId) => {
  //   try {
  //     await axios.get(`https://serveyousmartbe-production.up.railway.app/api/contact/${messageId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     enqueueSnackbar("Message marked as read", { variant: "success" });
  //     fetchMessages();
  //   } catch (error) {
  //     enqueueSnackbar("Failed to update message status", { variant: "error" });
  //   }
  // };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`https://serveyousmartbe-production.up.railway.app/api/contact/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      enqueueSnackbar("Message deleted successfully", { variant: "success" });
      fetchMessages();
    } catch {
      enqueueSnackbar("Failed to delete message", { variant: "error" });
    }
  };

  // Add these type definitions for the event handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredMessages = messages.filter((message) => {
    if (!message) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      message._id?.toLowerCase().includes(searchLower) ||
      message.name?.toLowerCase().includes(searchLower) ||
      message.email?.toLowerCase().includes(searchLower) ||
      message.subject?.toLowerCase().includes(searchLower) ||
      message.message?.toLowerCase().includes(searchLower)
    );
  });

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredMessages.length - page * rowsPerPage);

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
          Contact Messages
        </Typography>
        <Box>
          <TextField
            label="Search Messages"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchMessages}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="contact messages table">
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((message) => (
                  <TableRow key={message._id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {message.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        {message.name}
                      </Box>
                    </TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ maxWidth: 200 }}>
                        {message.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ maxWidth: 300 }}>
                        {message.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {message.createdAt
                        ? format(
                            new Date(message.createdAt),
                            "MMM dd, yyyy HH:mm"
                          )
                        : "N/A"}
                    </TableCell>
                    {/* <TableCell>
                      <Chip
                        label={message.read ? "Read" : "Unread"}
                        color={message.read ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell> */}
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip
                          // fontSize="small"
                          title="View Message Details"
                          className="mt-2 cursor-pointer"
                        >
                          <IconButton
                            color="success"
                            onClick={() =>
                              router.push(`/messagedetails/${message._id}`)
                            }
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Message">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteMessage(message._id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Reply">
                          <IconButton
                            color="primary"
                            href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                          >
                            <Mail fontSize="small" />
                          </IconButton>
                        </Tooltip> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            )}
            {emptyRows > 0 && !loading && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredMessages.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AdminContactMessagesTable;
