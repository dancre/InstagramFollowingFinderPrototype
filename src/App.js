import { useState } from 'react';
import { Input } from 'antd';
import axios from 'axios';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const { Search } = Input;

const App = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [followingsByUsername, setFollowingsByUsername] = useState("");
  const [loadingFollowings, setLoadingFollowings] = useState(false);
  const [rowData, setRowData] = useState([]);

  const splitStringWithCommasAndOrSpacesIntoArray = string => {
    return string.split(',')
      .map(item => item.split(' '))
      .flat()
      .filter(item => item)
  }

  const getFollowings = async () => {
    if (!followingsByUsername.length || loadingFollowings) {
      alert("Please enter at least one username...")
      return;
    }

    setLoadingFollowings(true);

    const userNames = splitStringWithCommasAndOrSpacesIntoArray(followingsByUsername)

    const res = await axios.post('http://localhost:8080/users', {
      "usernames": userNames
    });

    setLoadingFollowings(false);

    if (res.statusText !== "OK" || res.status !== 200) {
      alert('something bad happened...!')
    }

    // console.log(res.data)
    let dataToReturn = [];
    for(const data of res.data) {
      for(const user in data) {
        dataToReturn.push(...data[user].map(item => { return {
          followerUserName: user,
          id: item.pk,
          fullName: item.full_name,
          username: item.username}}))
      }
    }
    setRowData(dataToReturn)
    // console.log(dataToReturn)
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Following Finder Thingy...</p>
        <div className="Form-container">
          <Search 
            placeholder="Enter one or more Instagram usernames, separated by a comma (, ) or space (' ')"
            enterButton="Search"
            size="large"
            loading={loadingFollowings}
            value={followingsByUsername}
            onSearch={async () => await getFollowings()} 
            className="Form-input" 
            onChange={event => setFollowingsByUsername(event.target.value)} />
        </div>
      </header>
      <div className="App-results">
        <div className="ag-theme-alpine" style={ { height: "70vh"} }>
          <AgGridReact rowData={rowData}>
            <AgGridColumn field="followerUserName" sortable={true} filter={true} ></AgGridColumn>
            <AgGridColumn field="id" sortable={true} filter={true} ></AgGridColumn>
            <AgGridColumn field="fullName" sortable={true} filter={true} ></AgGridColumn>
            <AgGridColumn field="username" sortable={true} filter={true} ></AgGridColumn>
          </AgGridReact>
        </div>
      </div>
    </div>
  );
}

export default App;
