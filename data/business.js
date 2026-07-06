// Centralized business and product configuration for Sri Shakthi Agros
window.dealershipData = {
  business: {
    name: "Sri Shakthi Agros",
    focus: "Powertrac Tractors",
    manufacturer: "Escorts Kubota Limited",
    contactPerson: "S. Muthukrishnan",
    phone: "98409 30913",
    phoneClean: "9840930913",
    email: "srishakthiagros@gmail.com",
    address: {
      street: "264/17 M.B.T Road, Balaji Nagar, Ammananthangal",
      landmark: "Near Balaji Mahal",
      city: "Walajapet",
      pincode: "632513",
      district: "Ranipet District",
      state: "Tamil Nadu",
      country: "India"
    },
    branch: "Panapakkam Road, Nemeli",
    whatsappClean: "919840930913", // International format for API
    description: "Sri Shakthi Agros is a trusted Powertrac tractor dealership based in Walajapet, Tamil Nadu. The dealership serves farmers and agricultural customers with Powertrac tractors, genuine spare parts, service assistance, maintenance support, and customer guidance."
  },
  
  tractors: [
    {
      id: "euro-50",
      name: "Powertrac Euro 50",
      hpCategory: "50 HP",
      transmission: "Fully Constant Mesh (8 Forward + 2 Reverse)",
      driveType: "2WD / 4WD",
      category: "agriculture",
      image: "assets/tractors/euro_50.png",
      description: "Best-in-class multi-speed tractor designed for heavy-duty farming, rotary tilling, and haulage. Built with advanced hydraulic lift capacity and premium driver comfort features.",
      specs: {
        engine: "3-Cylinder Powertrac Engine",
        clutch: "Dual / Double Clutch",
        brakes: "Multi Plate Oil Immersed Disc Brakes",
        liftingCapacity: "1800 kg",
        steering: "Balanced Power Steering"
      }
    },
    {
      id: "euro-42-plus",
      name: "Powertrac Euro 42 Plus",
      hpCategory: "44 HP",
      transmission: "Constant Mesh (8 Forward + 2 Reverse)",
      driveType: "2WD",
      category: "utility",
      image: "assets/tractors/euro_50.png", // Reuse high quality euro_50 as visual fallback
      description: "Fuel-efficient and highly versatile tractor perfect for everyday tillage, seeding, and general agricultural operations. Features a modern instrument console and ergonomic seating.",
      specs: {
        engine: "3-Cylinder Fuel-Efficient Engine",
        clutch: "Single / Dual Clutch Option",
        brakes: "Multi Plate Oil Immersed Disc Brakes",
        liftingCapacity: "1600 kg",
        steering: "Power / Mechanical Option"
      }
    },
    {
      id: "euro-47",
      name: "Powertrac Euro 47",
      hpCategory: "47 HP",
      transmission: "Constant Mesh with Side Shift (8 Forward + 2 Reverse)",
      driveType: "2WD",
      category: "agriculture",
      image: "assets/tractors/euro_47.png",
      description: "High performance tractor featuring balanced power and efficiency. Specifically optimized for puddling, cultivation, and heavy trailer towing with durable rear axle setup.",
      specs: {
        engine: "3-Cylinder High-Torque Engine",
        clutch: "Dual Clutch",
        brakes: "Oil Immersed Brakes",
        liftingCapacity: "1600 kg",
        steering: "Balanced Power Steering"
      }
    },
    {
      id: "euro-55",
      name: "Powertrac Euro 55",
      hpCategory: "55 HP",
      transmission: "Dual Clutch (8 Forward + 2 Reverse / 12+3 Optional)",
      driveType: "2WD / 4WD",
      category: "agriculture",
      image: "assets/tractors/euro_50.png", // Visual fallback
      description: "Powerful heavy-duty agricultural engine built for commercial implements, large farms, and demanding field jobs. Offers unmatched PTO power and rugged structural reliability.",
      specs: {
        engine: "4-Cylinder Heavy-Duty Engine",
        clutch: "Double Clutch",
        brakes: "Multi Plate Oil Immersed Disc Brakes",
        liftingCapacity: "1800 - 2200 kg",
        steering: "Balanced Power Steering"
      }
    },
    {
      id: "powertrac-439-plus",
      name: "Powertrac 439 Plus",
      hpCategory: "41 HP",
      transmission: "Fully Constant Mesh (8 Forward + 2 Reverse)",
      driveType: "2WD",
      category: "utility",
      image: "assets/tractors/euro_47.png", // Visual fallback
      description: "Highly reliable utility tractor, a trusted partner for mixed crop farming, rotavator operations, and general purpose agricultural haulage. Renowned for low maintenance costs.",
      specs: {
        engine: "3-Cylinder Reliable Diesel Engine",
        clutch: "Single / Dual Clutch Option",
        brakes: "Multi Plate Oil Immersed Disc Brakes",
        liftingCapacity: "1600 kg",
        steering: "Power / Mechanical Option"
      }
    },
    {
      id: "powertrac-434",
      name: "Powertrac 434",
      hpCategory: "37 HP",
      transmission: "Constant Mesh (8 Forward + 2 Reverse)",
      driveType: "2WD",
      category: "compact",
      image: "assets/tractors/euro_47.png", // Visual fallback
      description: "Compact and highly maneuverable agricultural tractor, ideal for orchards, vineyards, small fields, and budget-conscious farmers who require dependable power in tighter spaces.",
      specs: {
        engine: "3-Cylinder Fuel Saver Engine",
        clutch: "Single Clutch",
        brakes: "Multi Plate Oil Immersed Disc Brakes",
        liftingCapacity: "1600 kg",
        steering: "Mechanical / Power Option"
      }
    }
  ],
  
  services: [
    {
      id: "sales",
      title: "Tractor Sales",
      description: "Explore Powertrac tractors and get expert assistance selecting a model matched exactly to your agricultural requirements, soil conditions, and budget.",
      image: "assets/dealership/showroom_interior.png",
      details: [
        "Expert product consultations",
        "Demonstration of tractor models",
        "Custom agricultural configurations",
        "Direct guidance on farming implements"
      ]
    },
    {
      id: "service",
      title: "Tractor Service & Repairs",
      description: "Book tractor inspection, general service, periodic maintenance, engine overhauls, and general repair assistance at our dealership workshop.",
      image: "assets/dealership/showroom_lineup.png",
      details: [
        "Experienced tractor technicians",
        "Periodic lubrication and oil changes",
        "Hydraulic and transmission tuning",
        "Engine diagnostic and rebuild assistance"
      ]
    },
    {
      id: "spare-parts",
      title: "Tractor Spare Parts",
      description: "Enquire about tractor spare parts, body panels, filters, electrical assemblies, and industrial agricultural components.",
      image: "assets/dealership/showroom_exterior.png",
      details: [
        "100% Genuine Powertrac parts",
        "Agricultural components in stock",
        "Fast ordering for special parts",
        "Automotive plastic panels & guards"
      ]
    },
    {
      id: "support",
      title: "Customer Guidance",
      description: "Contact Sri Shakthi Agros for detailed tractor enquiries, service assistance, technical advice, and ongoing tractor ownership support.",
      image: "assets/dealership/showroom_interior.png",
      details: [
        "Dedicated customer care cell",
        "Quick response via Phone & WhatsApp",
        "Agricultural advisory on tractor usage",
        "Post-warranty maintenance schedules"
      ]
    }
  ],
  
  spareParts: [
    {
      id: "automotive-spare-parts",
      name: "Automotive Spare Parts",
      description: "High-durability spare parts engineered to withstand demanding tractor mechanics, including filters, gaskets, belts, and engine internals.",
      image: "assets/dealership/showroom_interior.png"
    },
    {
      id: "tractor-spare-parts",
      name: "Tractor Spare Parts",
      description: "100% genuine Powertrac replacement parts ensuring exact fitment, factory performance, and long term mechanical reliability of your tractor.",
      image: "assets/dealership/showroom_exterior.png"
    },
    {
      id: "automotive-plastic-components",
      name: "Automotive Plastic Components",
      description: "Durable and UV-resistant structural plastic elements, custom guards, panels, instrument dashboards, and grilles tailored for Powertrac machines.",
      image: "assets/dealership/showroom_lineup.png"
    },
    {
      id: "automotive-components",
      name: "Automotive Components",
      description: "Heavy-duty industrial agricultural components, precision bearings, gearsets, clutch discs, and high-pressure hydraulic pumps.",
      image: "assets/dealership/showroom_interior.png"
    }
  ],

  images360: [
    "assets/tractors/360/frame_01.png",
    "assets/tractors/360/frame_02.png",
    "assets/tractors/360/frame_03.png",
    "assets/tractors/360/frame_04.png"
  ]
};
