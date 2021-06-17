import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Voting from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, voting: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Voting.networks[networkId];
      const instance = new web3.eth.Contract(
        Voting.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runInit = async() => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    const voting = await contract.methods.VoterRegistered().call();

    // Update state with the result.
    this.setState({ voting: voting });
  };

  addToWhiteList = async () => {
    const { accounts, contract } = this.state;
    const address = this.address.value;

    await contract.methods.addToWhiteList(address).send({from: accounts[0]});

    this.runInit();
  }

  render() {
    const { voting } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
            <h2 className="text-center">Elections</h2>
            <hr></hr>
            <br></br>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Card style={{ width: '50rem' }}>
            <Card.Header><strong>White listed addresses, allowed to propose!</strong></Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>@</th>
                      </tr>
                    </thead>
                  </Table>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
        <br></br>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Card style={{ width: '50rem' }}>
            <Card.Header><strong>Add account</strong></Card.Header>
            <Card.Body>
              <Form.Group controlId="formAddress">
                <Form.Control type="text" id="address"
                ref={(input) => { this.address = input }}
                />
              </Form.Group>
              <Button onClick={ this.voting } variant="dark" > Authorize </Button>
            </Card.Body>
          </Card>
          </div>
        <br></br>
      </div>
    );
  }
}

export default App;
