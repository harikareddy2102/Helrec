import { useState, useEffect } from "react";
import { Contract, BrowserProvider, getAddress } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your deployed contract address
const abi = [
  {
    "inputs": [
      { "internalType": "address", "name": "_provider", "type": "address" }
    ],
    "name": "authorizeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_dataHash", "type": "string" }
    ],
    "name": "createRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_provider", "type": "address" }
    ],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [newRecord, setNewRecord] = useState('');
  const [records, setRecords] = useState([]); // Store records for display
  const [authorizedAddress, setAuthorizedAddress] = useState('');
  const [accessRecord, setAccessRecord] = useState(''); // Record for access authorization/revocation
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const browserProvider = new BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await browserProvider.getSigner();
        const accountAddress = await signer.getAddress();

        setAccount(accountAddress);

        const healthContract = new Contract(contractAddress, abi, signer);
        setContract(healthContract);
        console.log('Wallet connected and contract initialized:', healthContract);
      } else {
        console.log('MetaMask not detected');
      }
    } catch (error) {
      console.error('Error connecting wallet: ', error);
    }
  };

  // Create a new patient record
  const createRecord = async () => {
    try {
      if (contract) {
        const tx = await contract.createRecord(newRecord);
        await tx.wait();
        setSuccessMessage('New record created successfully.');
        setRecords([...records, newRecord]); // Add new record to display list
        setNewRecord(''); // Clear input field
        fadeOutMessage(); // Trigger fade effect for the message
        console.log('New record created:', newRecord);
      }
    } catch (error) {
      setError("Error creating record.");
      console.error('Error creating record:', error);
    }
  };

  // Authorize access to another provider for a specific record
  const authorizeAccess = async () => {
    try {
      setError(null);
      if (contract) {
        const formattedAddress = getAddress(authorizedAddress);
        const tx = await contract.authorizeAccess(formattedAddress);
        await tx.wait();
        setSuccessMessage(`Access authorized for: ${formattedAddress} on record: ${accessRecord}`);
        setAuthorizedAddress('');
        setAccessRecord(''); // Clear inputs
        fadeOutMessage();
      }
    } catch (error) {
      setError("Invalid address format. Please enter a valid Ethereum address.");
      console.error('Error authorizing access:', error);
    }
  };

  // Revoke access from a provider for a specific record
  const revokeAccess = async () => {
    try {
      setError(null);
      if (contract) {
        const formattedAddress = getAddress(authorizedAddress);
        const tx = await contract.revokeAccess(formattedAddress);
        await tx.wait();
        setSuccessMessage(`Access revoked for: ${formattedAddress} on record: ${accessRecord}`);
        setAuthorizedAddress('');
        setAccessRecord(''); // Clear inputs
        fadeOutMessage();
      }
    } catch (error) {
      setError("Invalid address format. Please enter a valid Ethereum address.");
      console.error('Error revoking access:', error);
    }
  };

  // Delete a record from the list
  const deleteRecord = (recordToDelete) => {
    setRecords(records.filter(record => record !== recordToDelete));
  };

  // Fade out the success message after a few seconds
  const fadeOutMessage = () => {
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: 'url(./backgroundhealth.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      textAlign: 'center',
      padding: '20px',
      color: '#fff' // Set default text color to white for readability over the background
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '40px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}>
        <h1 style={{ color: '#000080', fontSize: '2.5em' }}>Decentralized Healthcare App</h1>
        {account ? (
          <div>
            <p style={{ color: '#000000' }}>Connected Account: {account}</p>

            <div>
              <h2 style={{ color: '#800080' }}>Create New Record</h2>
              <input
                type="text"
                placeholder="New Record Hash"
                value={newRecord}
                onChange={(e) => setNewRecord(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderColor: '#008B8B',
                  borderRadius: '4px'
                }}
              />
              <button onClick={createRecord} style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#008B8B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Create Record
              </button>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h2 style={{ color: '#A52A2A' }}>Authorize/Revoke Provider Access</h2>
              <input
                type="text"
                placeholder="Provider Address"
                value={authorizedAddress}
                onChange={(e) => setAuthorizedAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderColor: '#FF6347',
                  borderRadius: '4px'
                }}
              />
              <input
                type="text"
                placeholder="Record for Access"
                value={accessRecord}
                onChange={(e) => setAccessRecord(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderColor: '#FF6347',
                  borderRadius: '4px'
                }}
              />
              <button onClick={authorizeAccess} style={{
                width: '48%',
                padding: '10px',
                backgroundColor: '#32CD32',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '4%'
              }}>
                Authorize Access
              </button>
              <button onClick={revokeAccess} style={{
                width: '48%',
                padding: '10px',
                backgroundColor: '#FF6347',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Revoke Access
              </button>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h2 style={{ color: '#8A2BE2' }}>Records</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {records.map((record, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: '#D3D3D3',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    color: '#000'
                  }}>
                    {record}
                    <button onClick={() => deleteRecord(record)} style={{
                      padding: '5px 10px',
                      color: 'red',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {successMessage && <p style={{ color: '#32CD32' }}>{successMessage}</p>}
            {error && <p style={{ color: '#FF4500' }}>{error}</p>}
          </div>
        ) : (
          <button onClick={connectWallet} style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4682B4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Connect MetaMask
          </button>
        )}
      </div>
    </div>

  );
}

export default App;
