export default {
  header: {
    self: {},
    items: [
      {
        title: "Dashboards",
        root: true,
        alignment: "left",
        page: "admin/dashboard",
        translate: "MENU.DASHBOARD"
      }
    ]
  },
  aside: {
    self: {},
    items: [
      {
        title: "Dashboard",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "admin/dashboard",
        translate: "MENU.DASHBOARD",
        bullet: "dot"
      },
      
      {
        title: "Assets",
        root: true,
        bullet: "dot",
        icon: "fa fa-ticket-alt",
        submenu: [
          {
            title: "Aircraft",
            parent_title: "Assets",
            root: true,
            bullet: "dot",
            page:'admin/aircraft/asset',
          },
          {
            title: "Engines",
            parent_title: "Assets",
            root: true,
            bullet: "dot",
            page:'admin/engine/asset',
          },
          {
            title: "APU",
            parent_title: "Assets",
            root: true,
            bullet: "dot",
            page:'admin/apu/asset',
          },
          {
            title: "Parts",
            parent_title: "Assets",
            root: true,
            bullet: "dot",
            page:'admin/part/asset',
          },
          {
            title: "Wanted",
            parent_title: "Assets",
            root: true,
            bullet: "dot",
            page:'admin/wanted/asset',
          },
        ]
      },
      {
        title: "Leads",
        root: true,
        bullet: "dot",
        icon: "fa fa-dollar-sign",
        page:'admin/lead',
      },
      {
        title: "Contacts",
        root: true,
        icon: "flaticon-avatar",
        page:'admin/contacts',
      },
      {
        title: "Companies",
        root: true,
        bullet: "dot",
        icon: "flaticon-buildings",
        page:'admin/companies',
      },
      {
        title: "News",
        root: true,
        bullet: "dot",
        icon: "flaticon2-open-text-book",
        page:'admin/news',
      },
      {
        title: "Events",
        root: true,
        bullet: "dot",
        icon: "flaticon-event-calendar-symbol",
        page: "admin/events",
      },
      {
        title: "Airports",
        bullet: "dot",
        icon: "fa fa-plane-arrival",
        page:'admin/airport',
      },
      {
        title: "Adverts",
        root: true,
        bullet: "dot",
        icon: "flaticon2-speaker",
        page:'admin/adverts',
      },
      {
        title: "Sales & Support",
        root: true,
        bullet: "dot",
        icon: "flaticon-diagram",
        submenu: [
          {
            title: "Sales & Invoices",
            parent_title: "Sales & Support",
            bullet: "dot",
            page:'admin/invoices',
          },
          {
            title: "Plans",
            parent_title: "Sales & Support",
            bullet: "dot",
            page:'admin/plans',
          },
          {
            title: "Enquiries",
            parent_title: "Sales & Support",
            bullet: "dot",
            page:'admin/contactqueries',
          },
          {
            title: "Subscribers",
            parent_title: "Sales & Support",
            bullet: "dot",
            page: "admin/subscriber",
          },
        ]
      },
      {
        title: "Asset Setup",
        root: true,
        bullet: "dot",
        icon: "flaticon2-start-up",
        submenu: [
          {
            title: "Aircraft Categories",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/aircraft/category',
          },
          {
            title: "Aircraft Manufacturers",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/aircraft/manufacturer',
          },
          {
            title: "Aircraft Types",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/aircraft/type',
          },
          {
            title: "Aircraft Models",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/aircraft/model',
          },
          {
            title: "Aircraft Configurations",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/aircraft/configuration',
          },
          {
            title: "Engines Categories",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/engine/category',
          },
          {
            title: "Engines Manufacturers",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/engine/manufacturer',
          },
          {
            title: "Engines Types",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/engine/type',
          },
          {
            title: "Engines Models",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/engine/model',
          },
          {
            title: "APU Categories",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/apu/category',
          },
          {
            title: "APU Manufacturers",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/apu/manufacturer',
          },
          {
            title: "APU Types",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/apu/type',
          },
          {
            title: "APU Models",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/apu/model',
          },
          {
            title: "Part Conditions",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/parts/condition',
          },
          {
            title: "Part Releases",
            parent_title: "Asset Setup",
            bullet: "dot",
            page:'admin/parts/release',
          },
        ]
      },
      {
        title: "General Setup",
        root: true,
        bullet: "dot",
        icon: "flaticon2-open-box",
        submenu: [
          {
            title: "Email Templates",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/email-template',
          },
          {
            title: "News Categories",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/news/category',
          },
          {
            title: "Event Categories",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/event/category',
          },
          {
            title: "Airfield Types",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/airfield',
          },
          {
            title: "Job Title",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/titles',
          },
          {
            title: "Specialities",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/speciality',
          },
          {
            title: "Continents",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/continent',
          },
          {
            title: "Regions",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/region',
          },
          {
            title: "Countries",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/countries',
          },
          {
            title: "States",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/states',
          },
          {
            title: "Cities",
            parent_title: "General Setup",
            bullet: "dot",
            page:'admin/cities',
          },
          
        ]
      },
      {
        title: "Security",
        root: true,
        bullet: "dot",
        icon: "flaticon-security",
        submenu: [
          {
            title: "Airbookers",
            parent_title: "Security",
            bullet: "dot",
            page:'admin/airbookers',
          },
          {
            title: "Admin Users",
            parent_title: "Security",
            bullet: "dot",
            page:'admin/admin-user',
          },
          {
            title: "Role & Permission",
            parent_title: "Security",
            bullet: "dot",
            page:'admin/role-permission',
          },
          {
            title: "Access Logs",
            parent_title: "Security",
            bullet: "dot",
            page:'admin/accesslogs',
          },
        ]
      },
      {
        title: 'Settings', // <= Title of the page
        root: true,
        page:'admin/settings', // <= URL
        icon: 'flaticon-cogwheel', // <= Choose the icon
        submenu: [
          {
            title: "Portal Settings",
            parent_title: "Settings",
            bullet: "dot",
            page: "admin/settings"
          },
          {
            title: "Layout Builder",
            parent_title: "Settings",
            root: true,
            page: "admin/builder"
          },
          {
            title: "Static Pages",
            parent_title: "Settings",
            bullet: "dot",
            page:'admin/cms',
          },{
            title: "SEO",
            parent_title: "Settings",
            bullet: "dot",
            page:'admin/seos',
          },
        ]
      },
      {
        title: 'Media Gallery', // <= Title of the page
        page:'admin/media', // <= URL
        icon: "flaticon2-image-file",
      },
      { section: "Custom" },
      // {
      //   root: true,
      //   title: "Documentation",
      //   bullet: "dot",
      //   icon: "flaticon2-file-1",
      //   submenu: [
      //     { title: "Quick Start", page: "docs/quick-start" },
      //     { title: "Overview", page: "docs/overview" },
      //     { title: "Deployment", page: "docs/deployment" },
      //     { title: "Internationalization", page: "docs/i18n" },
      //     { title: "Mock Backend", page: "docs/mock-backend" },
      //     { title: "Create a Page", page: "docs/create-a-page" }
      //   ]
      // },
      {
        title: "Error Pages",
        root: true,
        bullet: "dot",
        icon: "flaticon-danger",
        submenu: [
          {
            title: "Error Page - 1",
            page: "admin/error/error-v1"
          },
          {
            title: "Error Page - 2",
            page: "admin/error/error-v2"
          },
          {
            title: "Error Page - 3",
            page: "admin/error/error-v3"
          },
          {
            title: "Error Page - 4",
            page: "admin/error/error-v4"
          },
          {
            title: "Error Page - 5",
            page: "admin/error/error-v5"
          },
          {
            title: "Error Page - 6",
            page: "admin/error/error-v6"
          }
        ]
      }
    ]
  }
};


