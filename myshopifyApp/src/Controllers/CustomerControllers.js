const Shopify = require("shopify-api-node");
const DB = require("../Models/index");
const shop = DB.shop;
const customer = DB.customer;
const address = DB.address;
const Op = DB.Sequelize.Op;

// @Route - /customer/:ShopName | @DESC Get all Customers data | @Access Private
const getCustomers = async (req, res) => {
  const shopName = req.params.shopName;
  try {
    // Find Shop data
    const shopData = await shop.findOne({
      where: { domain: req.params.shopName },
    });

    // if Shop is not found or exits
    if (!shopData) {
      return res.status(404).json({ message: "Shop is not Found" });
    }

    const shopify = new Shopify({
      shopName: shopName,
      accessToken: shopData.AccessToken,
    });

    //  get all Cusomers data
    const Customers = await shopify.customer.list();
    if (Customers) {
      res.status(200).send(Customers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @Route - /customer/:ShopName | @DESC - Create and Update all Customers
const addCustomers = async (req, res) => {
  const shopName = req.params.shopName;
  try {
    // Find Shop data
    const shopData = await shop.findOne({
      where: { domain: req.params.shopName },
    });

    // if Shop is not found or exits
    if (!shopData) {
      return res.status(404).json({ message: "Shop is not Found" });
    }

    const shopify = new Shopify({
      shopName: shopName,
      accessToken: shopData.AccessToken,
    });

    //  get all Cusomers data
    // const Customers = await shopify.customer.list();
    (async () => {
      let params = { limit: 30 };

      do {
        const Customers = await shopify.customer.list(params);

        // Here code
        if (Customers) {
          // Add and Update all Customers
          Customers.map(async (element) => {
            // If Customer is Already Exits
            const customerExits = await customer.findOne({
              where: { id: element.id },
            });
            if (customerExits) {
              // Update the customer record
              await customerExits.update({
                email: element.email,
                first_name: element.first_name,
                last_name: element.last_name,
                orders_count: element.orders_count,
                state: element.state,
                verified_email: element.verified_email,
                phone: element.phone,
              });

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
    res.status(200).json({ message: "Successfully Created✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//get pagination | page no and | size of one page
const getPagination = (page, size) => {
  // limit qual size of one page
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalusers, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalusers / limit);

  return { totalusers, users, totalPages, currentPage };
};

// @Route - /customer/ | @DESC - Get all Customers through localdatabse
const getAllcustomers = async (req, res) => {
  const { search, page, size } = req.query;

  // user search something
  const serachUser = search
    ? {
        [Op.or]: [
          {
            first_name: { [Op.like]: `%${search}%` },
          },
          {
            last_name: { [Op.like]: `%${search}%` },
          },
          {
            email: { [Op.like]: `%${search}%` },
          },
          {
            phone: { [Op.like]: `%${search}%` },
          },
        ],
      }
    : null;

  // set limit and size
  const { limit, offset } = getPagination(Number(page), Number(size));

  try {
    const data = await customer.findAndCountAll({
      include: [
        {
          model: address,
          as: "addresses",
        },
      ],
      where: serachUser,
      limit: limit,
      offset: offset,
    });
    const response = getPagingData(data, Number(page), limit);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Sync Customers Data
const syncCustomers = async (shopname) => {
  try {
    // Find Shop data
    const shopData = await shop.findOne({
      where: { domain: shopname },
    });

    // if Shop is not found or exits
    if (!shopData) {
      return;
    }

    const shopify = new Shopify({
      shopName: shopname,
      accessToken: shopData.AccessToken,
    });

    //  get all Cusomers data
    // const Customers = await shopify.customer.list();
    (async () => {
      let params = { limit: 30 };

      do {
        const Customers = await shopify.customer.list(params);

        // Here code
        if (Customers) {
          // Add and Update all Customers
          Customers.map(async (element) => {
            // If Customer is Already Exits
            const customerExits = await customer.findOne({
              where: { id: element.id },
            });
            if (customerExits) {
              // Update the customer record
              await customerExits.update({
                email: element.email,
                first_name: element.first_name,
                last_name: element.last_name,
                orders_count: element.orders_count,
                state: element.state,
                verified_email: element.verified_email,
                phone: element.phone,
              });

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
    console.error(error);
  }
};

// @DESC - Add Customer local Database and Shopify Store | @Route - /customer/ | @access Private
const addCustomer = async (req, res) => {
  // get Shop name
  const shopName = req.shopName;
  const accessToken = req.accesstoken;

  try {
    // Shopify Instance
    const shopify = new Shopify({
      shopName: shopName,
      accessToken: accessToken,
    });

    // Customer data
    const shopifyCustomer = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
    };

    // Add Customer in Shopify Store
    const createCustomer = await shopify.customer.create(shopifyCustomer);

    // Otherwise Create the data
    const cust = await customer.create({
      id: createCustomer.id,
      email: createCustomer.email,
      first_name: createCustomer.first_name,
      last_name: createCustomer.last_name,
      orders_count: createCustomer.orders_count,
      state: createCustomer.state,
      verified_email: createCustomer.verified_email,
      phone: createCustomer.phone,
    });

    // find This Customer
    const findCustomer = await customer.findOne({
      where: { id: createCustomer.id },
    });

    console.log(findCustomer);

    //add address to Customers
    createCustomer.addresses.map(async (element) => {
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

    res.status(200).json({ message: "Successfully customer Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// @DESC - Delete Customer local Database and Shopify Store | @Route - /customer/ | @access Private
const deleteCustomer = async (req, res) => {
  // get Shop name
  const shopName = req.shopName;
  const accessToken = req.accesstoken;
  const id = req.params.id;

  try {
    // Shopify Instance
    const shopify = new Shopify({
      shopName: shopName,
      accessToken: accessToken,
    });

    const deleteCustomer = await shopify.customer.delete(id);
    const delCust = await customer.destroy({where:{id:id}});
    res.status(200).json({message:'successfully Customer is deleted'});

  } catch (error) {
    console.log(error);
    res.status(500).json({error});
  }
};

// @DESC - Updated Customer local Database and Shopify Store | @Route - /customer/ | @access Private
const updatedCustomer = async (req, res) => {
  // get Shop name
  const shopname = req.shopName;
  const accessToken = req.accesstoken;
  const id = req.params.id;

  try {
    // Shopify Instance
    const shopify = new Shopify({
      shopName: shopname,
      accessToken: accessToken,
    });



    res.status(200).json({message:'successfully Customer is deleted'});

  } catch (error) {
    console.log(error);
    res.status(500).json({error});
  }
};


module.exports = {
  getCustomers,
  addCustomers,
  getAllcustomers,
  syncCustomers,
  addCustomer,
  deleteCustomer,
  updatedCustomer
};
