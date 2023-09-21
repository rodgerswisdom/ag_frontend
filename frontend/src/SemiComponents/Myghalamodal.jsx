import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import FloatingActionButtons from "./Floatingbtn";
import axiosInstance from "../axios";
import { format } from "date-fns";

const modalStyle = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "66%", // Set to 2/3 of the screen width
  height: "70vh", // Adjust the height as needed
  bgcolor: "#2AAA8A",
  boxShadow: 24,
  p: 3,
  overflowX: "auto", // Enable horizontal scrolling
  whiteSpace: "nowrap", // Prevent text wrapping
};

export default function MyghalaModal(props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [myghala, setMyghala] = useState([]);
  const [loading, setLoading] = useState(true);

  const [commodityList, setCommodityList] = useState([]);
  const [ghalaList, setGhalaList] = useState([]);
  const [userId, setUserId] = useState(null);

  const [selectedGhala, setSelectedGhala] = useState(null);
  const [bagsToSell, setBagsToSell] = useState(0);

  useEffect(() => {
    axiosInstance
      .get("/myghalas")
      .then((res) => {
        const data = res.data;
        setMyghala(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleSellButtonClick = (ghala) => {
    setSelectedGhala(ghala);
    setOpen(true);
  };

  const hasGhalas = myghala.length > 0;

  const handleSellCommodity = () => {
    if (selectedGhala && bagsToSell > 0) {
      axiosInstance.get('/user/me/')
        .then((res) => {
          const userIdData = res.data.id;
          setUserId(userIdData);
        });

      const newBagsStored = selectedGhala.bags_stored - bagsToSell;
      const newCommodity = selectedGhala.commodity_stored;
      setCommodityList([...commodityList, newCommodity]);

      const newGhala = selectedGhala.id;
      setGhalaList([...ghalaList, newGhala]);

      axiosInstance
        .put(`/myghalas/${selectedGhala.id}/`, {
          user: userId,
          bags_stored: newBagsStored,
          commodity_stored: commodityList,
          ghala: ghalaList,
        })
        .then((res) => {
          console.log(ghalaList);
          console.log(commodityList);
          setMyghala((prevMyghala) =>
            prevMyghala.map((ghala) =>
              ghala.id === selectedGhala.id ? { ...ghala, bags_stored: newBagsStored } : ghala
            )
          );
          setSelectedGhala(null);
        })
        .catch((error) => {
          console.error("Error updating bags stored:", error);
        });
    }
  };

  return (
    <div>
      <FloatingActionButtons onClick={handleOpen}>Open modal</FloatingActionButtons>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <p className="text-3xl text-white text-center pb-3 border-b-3 border-white">My Ghalas</p>

          {loading && <p className="text-green-500">Loading...</p>}

          {!loading && !hasGhalas && (
            <div className="text-center">
              <p>You haven't rented yet. <a href="/ghalas" className="text-green-500">Rent now</a></p>
            </div>
          )}

          {!loading && hasGhalas && (
            <div style={{ display: "flex", flexDirection: "row-reverse", justifyContent: "flex-end" }}>
              {myghala.map((ghala) => (
                <div key={ghala.id} className="ml-4">
                  <div className="shadow-md p-2 my-4 rounded-sm border-1 border-green-500 bg-white">
                    <button className="absolute top-2 right-2" onClick={handleClose}>
                      Close
                    </button>
                    <p className="font-medium mb-2 pb-1 border-b-1 border-green-500">Ghala: {ghala.ghala_name}</p>
                    <p>
                      <span className="italic">Bags Stored:</span> {ghala.bags_stored}
                    </p>
                    <p>Date Rented: {format(new Date(ghala.date_rented), "MM/dd/yyyy")}</p>
                    <p className="mt-1">Duration: {ghala.duration_of_storage} months</p>
                    <button onClick={() => handleSellButtonClick(ghala)} className="p-2 text-center bg-green-500 border-1 border-green-500 mt-2">Sell Commodity</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Box>
      </Modal>

      {selectedGhala && (
        <Modal
          open={selectedGhala !== null}
          onClose={() => setSelectedGhala(null)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <p className="text-3xl text-white text-center border-b-1 border-green-500">Sell Commodity</p>
            <div className="grid grid-cols-2 gap-8 px-24">
              <p>
                <span className="font-medium">Ghala:</span> {selectedGhala.ghala_name}
              </p>
              <p>
                <span className="italic">Bags Stored:</span> {selectedGhala.bags_stored}
              </p>
            </div>
            <input
              type="number"
              placeholder="Enter bags to sell"
              value={bagsToSell}
              onChange={(e) => setBagsToSell(parseInt(e.target.value, 10))}
            />
            <p>Price: Ksh{selectedGhala.commodity_stored.price}</p>
            <button onClick={handleSellCommodity}>Sell</button>
          </Box>
        </Modal>
      )}
    </div>
  );
}
