import {
  Page,
  LegacyCard,
  DataTable,
  Text,
  Button,
  Pagination,
  TextField,
  Icon,
} from "@shopify/polaris";
import { SearchMajor, CustomerPlusMajor } from "@shopify/polaris-icons";
import React, { useMemo } from "react";
import axios from "../../api/axios";
import { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import CustomerModal from "./CustomerModal";
const customerGeturl = "/customer/";

function Customers() {
  const navigate = useNavigate();
  const AuthToken = JSON.parse(sessionStorage.getItem("loggedInShop"))?.Token;

  const [active, setActive] = useState(false);

  // Handle Modal 
  const handleModal= useCallback(() => setActive(!active), [active]);

  // implement tottal no of page | size of pages | serach quary
  const [SearchQuery, setSearchQuery] = useState("");
  const [PageNo, setPageNo] = useState(0);
  const [PageSize, setPageSize] = useState(5);
  const [TotalPages, setTotalPages] = useState(0);
  const [CustomersData, setCustomersData] = useState([]);

  // Fetch Customers Data
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        customerGeturl +
          `?search=${SearchQuery}&page=${PageNo}&size=${PageSize}`,
        {
          headers: { Authorization: `Bearer ${AuthToken}` },
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      );
      setCustomersData(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    fetchCustomers();
  }, [PageNo, SearchQuery]);

  const rows = CustomersData.map((ele) => {
    const arr = [];
    arr.push(ele.first_name);
    arr.push(ele.last_name);
    arr.push(ele.phone);
    arr.push(ele.email);
    arr.push(
      <Button id={ele.id} onClick={handleModal} outline>
        View
      </Button>
    );
    return arr;
  });

  // Handle Search
  const handleChange = useCallback((value) => {
    console.log(value);
    setSearchQuery(value);
  }, []);

  return (
    <><Page>
      <div style={{ marginBottom: "20px"}}>
        <Button
          primary
          textAlign="end"
          icon={<Icon source={CustomerPlusMajor}  color="base" />}
          onClick={() => navigate('addcustomer')}
        >
          Add Customer
        </Button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <TextField
          value={SearchQuery}
          onChange={handleChange}
          autoComplete="off"
          placeholder={"Search Customers"}
          prefix={<Icon source={SearchMajor} color="base" />}
        />
      </div>

      <LegacyCard>
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text", "text"]}
          headings={["First Name", "Last Name", "phone", "Email", "View"]}
          rows={rows}
        />
      </LegacyCard>
      <div style={{ marginTop: "20px" }}>
        <Pagination
          hasPrevious
          onPrevious={() => {
            setPageNo((prev) => prev - 1);
          }}
          hasNext
          onNext={() => {
            setPageNo((prev) => prev + 1);
          }}
        />
      </div>
    </Page>
    <CustomerModal handleModal={handleModal} active={active} /></>
  );
}
export default Customers;
