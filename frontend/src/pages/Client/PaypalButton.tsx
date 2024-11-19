import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  totalPrice: number;
  ticketId: string | null;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ totalPrice, ticketId }) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <PayPalButtons
        createOrder={(data, actions) => {
          // Check if actions and actions.order are available
          if (!actions || !actions.order) {
            console.error("actions.order is undefined in createOrder");
            return Promise.reject("Payment creation failed");
          }

          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: `Event ticket #${ticketId}`,
                amount: {
                  currency_code: "USD",
                  value: totalPrice.toFixed(2),
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          // Return a Promise<void> as required
          return new Promise<void>((resolve, reject) => {
            if (!actions || !actions.order) {
              console.error("actions.order is undefined in onApprove");
              reject("Payment approval failed");
              return;
            }

            actions.order
              .capture()
              .then((details) => {
                console.log("Payment successful", details);

                // After successful payment, send confirmation to the backend
                if (ticketId) {
                  fetch("http://127.0.0.1:8000/api/v1/clients/payment/confirm", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ticket_id: ticketId,
                      payment_data: details,
                    }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log("Payment confirmation response:", data);
                      resolve(); // Resolve the promise once the process is complete
                    })
                    .catch((error) => {
                      console.error("Error confirming payment:", error);
                      reject(error);
                    });
                } else {
                  resolve();
                }
              })
              .catch((error) => {
                console.error("Error capturing the order:", error);
                reject(error);
              });
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;