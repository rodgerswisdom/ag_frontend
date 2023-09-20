import React, { useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axiosInstance from "../axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function GhalaModal(props) {
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [valuesForConfirmation, setValuesForConfirmation] = useState(null);

  const initialValues = {
    commodity: "",
    quantity: "",
    period: "",
  };

  const totalGhalaPrice = (values) => {
    const ghalaUnitRentPrice = 200; // Replace with your actual unit rent price
    const period = Number.parseInt(values.period, 10);
    const quantity = Number.parseInt(values.quantity, 10);
    const pricePayable = period * quantity * ghalaUnitRentPrice;
    return pricePayable;
  };

  const handleConfirmation = () => {
    setLoading(true);

    axiosInstance
      .post("/myghalas/", {
        user: props.userId, // Assuming you have the user ID available as a prop
        ghala: props.ghala_id,
        commodity_stored: valuesForConfirmation.commodity,
        bags_stored: valuesForConfirmation.quantity,
      })
      .then((response) => {
        setLoading(false);
        setConfirmationOpen(false);
        console.log(response)
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error message", error)
      });
  };

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Rent Ghala
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Rent Ghala</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
              setTotalPrice(totalGhalaPrice(values));
              setValuesForConfirmation(values);
              setSubmitting(false);
              setOpen(false);
              setConfirmationOpen(true);
            }}
          >
            {({ isSubmitting, values, handleChange }) => (
              <Form>
                <Field name="commodity" as={Select}>
                  <MenuItem value="commodity1">Commodity 1</MenuItem>
                  <MenuItem value="commodity2">Commodity 2</MenuItem>
                </Field>

                <Field
                  name="quantity"
                  type="number"
                  placeholder="Quantity"
                  className="p-2 rounded-lg outline-none border"
                  onChange={handleChange}
                />
                <ErrorMessage name="quantity" component="div" />

                <Field
                  name="period"
                  type="number"
                  placeholder="Period in months"
                  className="p-2 rounded-lg outline-none border"
                  onChange={handleChange}
                />
                <ErrorMessage name="period" component="div" />

                <p className="text-xl">Price: {totalPrice} </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#23CE6B] p-2 font-semibold text-white rounded-2xl"
                >
                  Rent Ghala
                </button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        disableBackdropClick={loading}
      >
        <DialogTitle>Confirm Ghala Rental</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Commodity: {valuesForConfirmation?.commodity}
            <br />
            Quantity: {valuesForConfirmation?.quantity}
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmation}
            color="primary"
            disabled={loading}
          >
            {loading ? "Please Wait..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
