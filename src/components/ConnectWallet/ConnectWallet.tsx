import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openE = !!anchorEl

//   useEffect(() => {
//     const updateWalletAddress = async () => {
//       if (address) {
//         // send address to backend
//     };

//     // Trigger the address update when connected
//     if (isConnected && address) {
//       updateWalletAddress();
//     }
//   }, [address, isConnected]); // Depend on address and isConnected

  const handleConnect = async () => {
    setError(null);
    try {
      if (connectors[0]) {
        await connect({ connector: connectors[0] });
        await open(); // Open the modal after connecting
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet.');
    }
  };

  const handleDisconnect = async () => {
    setError(null);
    try {
      await disconnect();
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect wallet.');
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {isConnected ? (
        <Box>
          <Button
            id="basic-button"
            variant="contained"
            className="button"
            aria-controls={openE ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openE ? 'true' : undefined}
            onClick={handleClick}
          >
            <img src="/walleticon.png" alt="WalletIcon" width="24px" height="24px" style={{ marginRight: '8px' }} />
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openE}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "initial",
              },
            }}
          >
            <MenuItem onClick={handleDisconnect} className="button">
              Disconnect Wallet
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Button
          variant="contained"
          className="button"
          onClick={handleConnect}
        >
          <img src="/walleticon.png" alt="WalletIcon" width="24px" height="24px" style={{ marginRight: '8px' }} />
          Connect Wallet
        </Button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
