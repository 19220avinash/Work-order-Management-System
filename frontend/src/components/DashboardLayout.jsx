import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function DashboardLayout() {

  const [loggedInUser, setLoggedInUser] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();
  const location = useLocation();

  // Detect screen size
  useEffect(() => {

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) setCollapsed(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      setLoggedInUser((decoded.role || "user").toLowerCase());
    }

    return () => window.removeEventListener("resize", handleResize);

  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const sidebarWidth = collapsed ? "80px" : "240px";

  // Menu items with role permissions
  const menuItems = [
    { to: "/admin", icon: "bi-grid", label: "Masters", roles: ["admin"] },

    { to: "/customer-dashboard", icon: "bi-card-list", label: "Purchase Orders", roles: ["admin", "planner","operator"] },

    { to: "/planner", icon: "bi-calendar-check", label: "Planning", roles: ["admin", "planner"] },

    { to: "/production", icon: "bi-receipt-cutoff", label: "Reel Register", roles: ["admin","production"] },

    { to: "/waste", icon: "bi-box-seam", label: "Reel Waste", roles: ["admin","production"] },

    { to: "/summary", icon: "bi-bar-chart", label: "Reel Reports", roles: ["admin","production"] },

    { to: "/production-real", icon: "bi-gear-fill", label: "Production", roles: ["admin"] },
    {
      to: "/production-report",icon:"bi-bar-chart",label:"Production Report", roles:["admin","production"]
    },

    { to: "/dispatch", icon: "bi-truck", label: "Dispatch Management", roles: ["admin"] }
  ];

  // Filter menu based on role
  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(loggedInUser)
  );

  // Dynamic Dashboard Title
  const getDashboardTitle = () => {

    const path = location.pathname;

    if (path.startsWith("/planner")) return "Planner Dashboard";
    if (path.startsWith("/production-real")) return "Production Dashboard";
    if (path.startsWith("/production")) return "Reel Register Dashboard";
    if (path.startsWith("/waste")) return "Waste Management Dashboard";
    if (path.startsWith("/summary")) return "Reports Dashboard";
    if (path.startsWith("/dispatch")) return "Dispatch Dashboard";
    if (path.startsWith("/customer-dashboard")) return "Purchase Orders Dashboard";
    if (path.startsWith("/admin")) return "Masters Dashboard";

    return "Admin Dashboard";
  };

  return (
    <div className="d-flex" style={{ overflowX: "hidden" }}>

      {/* MOBILE OVERLAY */}
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 1040
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className="bg-dark text-white position-fixed d-flex flex-column shadow-lg"
        style={{
          width: sidebarWidth,
          transition: "all 0.3s ease",
          zIndex: 1050,
          left: isMobile ? (collapsed ? "-240px" : "0") : "0",
          top: 0,
          height: "100vh",
          overflowY: "auto"
        }}
      >

        {/* LOGO */}
        <div className="p-3 border-bottom border-secondary text-center">
          <h5 className="fw-bold m-0">
            {collapsed ? "🏭" : "Dashboard"}
          </h5>
        </div>

        {/* MENU */}
        <nav className="nav flex-column align-items-center p-2 gap-2 flex-grow-1">

          {filteredMenu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => isMobile && setCollapsed(true)}
              className={({ isActive }) =>
                `nav-link w-100 text-center d-flex flex-column align-items-center justify-content-center rounded py-2 ${
                  isActive ? "bg-primary text-white shadow-sm" : "text-white"
                }`
              }
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              {!collapsed && <small className="mt-1">{item.label}</small>}
            </NavLink>
          ))}

        </nav>

        {/* FOOTER */}
        <div className="p-3 border-top border-secondary text-center">

          {!collapsed && (
            <>
              <div className="small text-secondary">Logged in as</div>
              <div className="fw-semibold mb-2 text-capitalize">
                {loggedInUser}
              </div>
            </>
          )}

          <button
            onClick={logout}
            className="btn btn-danger w-100 fw-semibold"
          >
            <i className="bi bi-box-arrow-right"></i>
            {!collapsed && " Logout"}
          </button>

        </div>

      </aside>

      {/* MAIN AREA */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isMobile ? "0" : sidebarWidth,
          transition: "margin-left 0.3s ease",
          width: "100%",
          minHeight: "100vh",
          overflowX: "hidden"
        }}
      >

        {/* TOPBAR */}
        <div
          className="bg-white shadow-sm px-3 px-md-4 py-3 d-flex justify-content-between align-items-center sticky-top"
          style={{ zIndex: 1030 }}
        >

          <div className="d-flex align-items-center gap-3">

            <button
              className="btn btn-light border"
              onClick={() => setCollapsed(!collapsed)}
            >
              <i className="bi bi-list"></i>
            </button>

            <h5 className="mb-0 fw-semibold text-secondary d-none d-sm-block">
              {getDashboardTitle()}
            </h5>

          </div>

          {/* PROFILE */}
          <div className="dropdown">

            <button
              className="btn btn-light border dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-person-circle"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow">

              <li className="dropdown-item-text fw-semibold text-capitalize">
                {loggedInUser}
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>

            </ul>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div
          className="p-3 p-md-4 bg-light"
          style={{ minHeight: "calc(100vh - 70px)" }}
        >
          <Outlet />
        </div>

      </div>

    </div>
  );
}