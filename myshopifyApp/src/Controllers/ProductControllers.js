const Shopify = require("shopify-api-node");
const DB = require("../Models/index");
const shop = DB.shop;
const product = DB.product;
const image = DB.images;
const variant = DB.variant;

// Sync Product Data in localDatabase
const Syncproduct = async (shopName) => {
  try {
    // Find Shop data
    const shopData = await shop.findOne({
      where: { domain: shopName },
    });

    // if Shop is not found or exits
    if (!shopData) {
      return;
    }

    // Shopify Instance
    const shopify = new Shopify({
        shopName: shopName,
        accessToken: shopData.AccessToken,
    });

    //  get all Product data | Implement Pagination
    (async () => {
        let params = { limit: 30 };
  
        do {
          const Product = await shopify.product.list(params);
          
          // Here code
          if (Product) {
            // Add and Update all Product
            Product.map(async (element) => {
              
              // If Product is Already Exits
              const productExits = await customer.findOne({
                where: { id: element.id },
              });

              if (productExits) {
                // Update the Product record
                await productExits.update({
                    id:element.id,
                    title:element.title,
                    body_html:element.body_html,
                    vendor:element.vendor,
                    product_type:element.product_type,
                    handle:element.handle,
                    published_at:element.published_at,
                    status:element.status,
                    created_at:element.created_at
                });

                // add Shop to product
                await productExits.addShop(shopData);

                // Get the Associated variants and Images
                //const variants = await productExits.
  
                // Get the associated address records
                const addresses = await customerExits.getAddresses();
  
                // Loop through the addresses and update each record
                element.addresses.map(async (element) => {
                  // Find the address record by ID
                  const findAddress = addresses.find(
                    (address) => address.id === element.id
                  );
  
                  if (findAddress) {
                    // Update the address record
                    await findAddress.update({
                      first_name: element.first_name,
                      last_name: element.last_name,
                      company: element.company || "",
                      address1: element.address1,
                      city: element.city,
                      province: element.province || "",
                      country: element.country,
                      zip: element.zip,
                      phone: element.phone,
                      country_name: element.country_name,
                    });
                  } else {
                    // Create a new address record if it doesn't exist
                    const newAddress = await address.create({
                      id: element.id,
                      first_name: element.first_name,
                      last_name: element.last_name,
                      company: element.company || "",
                      address1: element.address1,
                      city: element.city,
                      province: element.province || "",
                      country: element.country,
                      zip: element.zip,
                      phone: element.phone,
                      country_name: element.country_name,
                    });
  
                    // add customers
                    await customerExits.addAddress(newAddress);
                  }
                });
              } else {
                // Otherwise Create the data
                const CreateCustomers = await customer.create({
                  id: element.id,
                  email: element.email,
                  first_name: element.first_name,
                  last_name: element.last_name,
                  orders_count: element.orders_count,
                  state: element.state,
                  verified_email: element.verified_email,
                  phone: element.phone,
                });
  
                // find This Customer
                const findCustomer = await customer.findOne({
                  where: { id: element.id },
                });
  
                //add address to Customers
                element.addresses.map(async (element) => {
                  // Create address
                  const createAddress = await address.create({
                    id: element.id,
                    first_name: element.first_name,
                    last_name: element.last_name,
                    company: element.company || "",
                    address1: element.address1,
                    city: element.city,
                    province: element.province || "",
                    country: element.country,
                    zip: element.zip,
                    phone: element.phone,
                    country_name: element.country_name,
                  });
  
                  // Add Address
                  await findCustomer.addAddress(createAddress);
                });
              }
            });
          }
          params = Customers.nextPageParameters;
        } while (params !== undefined);
      })().catch(console.error);


    

  } catch (error) {
    console.log(error);
  }
};
