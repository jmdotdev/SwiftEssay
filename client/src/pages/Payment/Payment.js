import React from "react";
import "./Payment.css";
import money from "../../assets/images/money.gif";
import allmoney from "../../assets/images/money.webp";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import { TopNav } from "../../components/topnav/TopNav";
export const Payment = () => {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];
  return (
    <div className="payment">
      <TopNav/>
      <div className="header">
        <div className="left-section">
          <div className="image-section">
            <img src={money} alt="payment-image" />
            <p>Here is your money history so far.</p>
          </div>
        </div>
        <div className="right-section">
          <Box>
            <FormControl className="form">
              <InputLabel id="demo-simple-select-label">month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="month"
                onChange={handleChange}
              >
                <MenuItem value={10}>january</MenuItem>
                <MenuItem value={20}>february</MenuItem>
                <MenuItem value={30}>march</MenuItem>
                <MenuItem value={30}>april</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      <div className="payment-cards">
        <div className="card">
          <div className="money-section">
            <h3>$1544</h3>
            <p>total income</p>
          </div>
          <img src={allmoney} alt="total amount.png" />
        </div>
        <div className="card">
          <div className="money-section">
            <h3>$1544</h3>
            <p>total income</p>
          </div>
          <img src={allmoney} alt="total amount.png" />
        </div>
        <div className="card">
          <div className="money-section">
            <h3>$1544</h3>
            <p>pending amount</p>
          </div>
          <img src={allmoney} alt="total amount.png" />
        </div>
      </div>
      <div className="payment-history">
        <h3>Payment History</h3>
        <div style={{ height: 300, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
      </div>
    </div>
  );
};
