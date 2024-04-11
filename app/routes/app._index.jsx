

import React from 'react'
import { useLoaderData } from "@remix-run/react";
import {
    Card,
    DataTable,
    Text,
    Checkbox,
    Page,
    Layout,
    Badge
  } from "@shopify/polaris";


//Error fetching data (access denied qrapghql)


import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const orders = await admin.rest.resources.Order.all({
      session: session,
      status: "any",
    });
    console.log(orders);
    return json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return json({ error: "Failed to fetch orders. Check authentication and permissions." }, 500);
  }
}




function Orders() {
    // const { orders } = useLoaderData();   //access denied error
    // console.log(orders)

    const orders = {      // dummy data
        data: {
          orders: {
            edges: [
              {
                node: {
                  id: "123456789",
                  createdAt: "2024-04-12T10:00:00Z",
                  customer: {
                    displayName: "John Doe",
                  },
                  financialStatus: "paid",
                  fulfillmentStatus: "fulfilled",
                  totalPriceSet: {
                    shopMoney: {
                      amount: "100.00",
                      currencyCode: "USD",
                    },
                  },
                },
              },
              {
                node: {
                  id: "987654321",
                  createdAt: "2024-04-11T09:30:00Z",
                  customer: {
                    displayName: "Jane Smith",
                  },
                  financialStatus: "pending",
                  fulfillmentStatus: "unfulfilled",
                  totalPriceSet: {
                    shopMoney: {
                      amount: "50.00",
                      currencyCode: "USD",
                    },
                  },
                },
              },
              // Add more dummy data as needed
            ],
          },
        },
      };
          

    return (
      <Page  fullWidth
      title="Orders">
         {/* <ui-title-bar title={"Orders"}>
          </ui-title-bar> */}
          <Layout>
            <Layout.Section>
        <Card>
        <DataTable
          columnContentTypes={[
            "text",
            "text",
            "text",
            "text",
            "text",
            "text",
          ]}
          headerContentTypes={[
            "text",
            "text",
            "text",
            "text",
            "text",
            "text",
          ]}
          headings={[
            <Checkbox />,
            <Text variation="subdued">Orders</Text>,
            <Text variation="subdued">Date</Text>,
            <Text variation="subdued">Customer</Text>,
            <Text variation="subdued">Payment Status</Text>,
            <Text variation="subdued">Fulfillment Status</Text>,
            <Text variation="subdued">Total</Text>,
          ]}
          rows={orders.data.orders.edges.map((order) => [
            <Checkbox />,
            <Text>{order.node.id}</Text>,
            <Text>{new Date(order.node.createdAt).toLocaleDateString()}</Text>,
            <Text>{order.node.customer.displayName}</Text>,
            <Badge tone={order.node.financialStatus === "paid" ? "success" : "default"}>{order.node.financialStatus}</Badge>,
            <Badge tone={order.node.fulfillmentStatus === "fulfilled" ? "success" : "default"}>{order.node.fulfillmentStatus}</Badge>,
            <Text>{`${order.node.totalPriceSet.shopMoney.amount} ${order.node.totalPriceSet.shopMoney.currencyCode}`}</Text>,
          ])}
          textAlign="left" // Align checkboxes and text to the left
        />
      </Card>
      </Layout.Section>
      </Layout>
      </Page>
      
  );
}

export default Orders