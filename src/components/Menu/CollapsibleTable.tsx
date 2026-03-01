import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";
import DeletePage from "../DeletePage";
import { data, useLocation, useNavigate, useParams } from "react-router-dom";

interface CollapsibleTableProps {
  // onDeleteGroup: (id: number) => Promise<void>;
  addOnGroups: AddOnGroup[];
}
interface AddOn {
  id: number;
  item_name: string;
  price: number;
}
interface AddOnGroup {
  id: number;
  name: string;
  multiple_select: boolean;
  addOns: AddOn[];
}
export default function CollapsibleTable({
  addOnGroups,
}: CollapsibleTableProps) {
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set());

  const toggleGroup = (groupId: number) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(groupId)) {
      newOpenGroups.delete(groupId);
    } else {
      newOpenGroups.add(groupId);
    }
    setOpenGroups(newOpenGroups);
  };
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const restaurantId = id ? Number(id) : 0;

  const location = useLocation();
  const AddOnGroupDelete = async (id) => {
    const confirm = window.confirm("Do you wish to delete this group");
    if (confirm) {
      try {
        await axios.delete(
          `http://localhost:8080/menu/add-on-group/delete/${id}`,
        );
        const res = await axios.get(
          `http://localhost:8080/menu/variant/${restaurantId}`,
        );
        navigate(location.pathname, {
          state: {
            data: res.data.data.addOnGroups,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <TableContainer sx={{ maxHeight: "100%" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Group</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {addOnGroups.map((group) => (
            <>
              {/* Group Row */}
              <TableRow key={group.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      onClick={() => toggleGroup(group.id)}
                      size="small"
                    >
                      {openGroups.has(group.id) ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                    {group.name}
                  </Box>
                </TableCell>
                <TableCell>
                  {group.multiple_select ? "Multiple" : "Single"}
                </TableCell>
                <TableCell>{group.addOns.length}</TableCell>
                <TableCell>
                  <Button color="warning" variant="outlined">
                    Edit
                  </Button>
                  <Button color="success" sx={{ mx: 3 }} variant="contained">
                    Add
                  </Button>
                  <DeletePage
                    name={group.name}
                    id={group.id}
                    onDelete={() => AddOnGroupDelete(group.id)}
                  />
                </TableCell>
              </TableRow>

              {/* Collapsible AddOns Row */}
              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={4}
                >
                  <Collapse
                    in={openGroups.has(group.id)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ m: 1 }}>
                      <Table size="small">
                        <TableBody>
                          {group.addOns.map((addOn) => (
                            <TableRow key={addOn.id} hover>
                              <TableCell>{addOn.item_name}</TableCell>
                              <TableCell>₹{addOn.price}</TableCell>

                              <TableCell>
                                <Button color="warning" variant="contained">
                                  Edit
                                </Button>
                                <Button
                                  color="error"
                                  sx={{
                                    mx: 3,
                                  }}
                                  variant="outlined"
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
