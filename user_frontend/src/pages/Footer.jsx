export default function Footer() {
  return (
    <footer style={{ background: "#1c1b1f", color: "white", padding: "40px 20px" }}>
      
      <div 
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px"
        }}
      >

        {/* Address */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
            📍 Address
          </h3>
          <p style={{ color: "#cccccc" }}>
            Balwant Plaza, Sangali Road, Ichlkarnji
          </p>
        </div>

        {/* Reservations */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
            📞 Reservations
          </h3>
          <p style={{ color: "#cccccc" }}>
            <strong>Phone:</strong> +91 8956454578
          </p>
          <p style={{ color: "#cccccc" }}>
            <strong>Email:</strong> stromsofttechnology@gmail.com
          </p>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
            ⏰ Opening Hours
          </h3>
          <p style={{ color: "#cccccc" }}>
            Monday–Saturday: <strong>9.00 am to 6.00 pm</strong>
          </p>
          <p style={{ color: "#cccccc" }}>Sunday: Closed</p>
        </div>

        {/* Follow Us */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
            Follow Us
          </h3>
          <div style={{ display: "flex", gap: "15px" }}>
            <span style={iconStyle}>💬</span>
            <span style={iconStyle}>👍</span>
            <span style={iconStyle}>📸</span>
          </div>
        </div>

      </div>

      <hr style={{ marginTop: "40px", borderColor: "#333" }} />

      {/* Bottom Footer */}
      <div 
        style={{ 
          textAlign: "center",
          marginTop: "20px",
          color: "#bbbbbb",
          fontSize: "14px",
          lineHeight: "20px",
        }}
      >
        Designed by <strong>STORMSOFTS TECHNOLOGY</strong>
      </div>

    </footer>
  );
}

const iconStyle = {
  padding: "10px",
  borderRadius: "50%",
  border: "1px solid #555",
  cursor: "pointer"
};
