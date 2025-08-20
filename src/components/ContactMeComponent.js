import {
  Box,
  Button,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { MailOutline, Phone, LocationPin } from "@mui/icons-material";
import emailjs from "@emailjs/browser";
import { useRef } from "react";

function ContactMeComponent() {
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    );

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        (results) => {
          alert("Message sent successfully!");
        },
        (error) => {
          alert("Failed to send message: " + error);
        }
      );
  };

  return (
    <div className="contact-me-box">
      <Typography variant="h4" fontWeight="bold">
        Contact me
      </Typography>
      <div className="custom-divider"></div>
      <Toolbar disableGutters className="contact-me-body-box">
        <Box
          m={2}
          sx={{ width: { xs: "100%", md: "40%" } }}
          className="contact-me-links-box"
        >
          <Box className="contact-info-group">
            <Typography>
              <MailOutline
                className="card-button"
                sx={{ verticalAlign: "middle", mr: 1 }}
              />{" "}
              sumanthkumarkotagudem@gmail.com
            </Typography>
            <Typography>
              <Phone
                className="card-button"
                sx={{ verticalAlign: "middle", mr: 1 }}
              />{" "}
              +16692369620
            </Typography>
            <Typography>
              <LocationPin
                className="card-button"
                sx={{ verticalAlign: "middle", mr: 1 }}
              />{" "}
              San Jose, Caifornia, US
            </Typography>
          </Box>

          <Box className="social-links-group">
            <Button
              onClick={() => {
                window.open("https://www.linkedin.com/in/ksk-17/", "_blank");
              }}
              className="card-button"
            >
              LinkedIn
            </Button>
            <Button
              onClick={() => {
                window.open("https://github.com/ksk-17", "_blank");
              }}
              className="card-button"
            >
              Github
            </Button>
            <Button
              onClick={() => {
                window.open("https://www.kaggle.com/ksk872", "_blank");
              }}
              className="card-button"
            >
              Kaggle
            </Button>
          </Box>
        </Box>
        <Box
          m={2}
          sx={{ width: { xs: "100%", md: "60%" } }}
          className="contact-me-forms-box"
        >
          <form ref={formRef} onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              variant="standard"
              fullWidth
              className="custom-textfield"
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="standard"
              fullWidth
              className="custom-textfield"
              required
            />
            <TextField
              label="Message"
              name="message"
              variant="standard"
              fullWidth
              multiline
              minRows={10}
              className="custom-textfield"
              required
            />
            <Box display="flex" justifyContent="center" mt={4}>
              <Button type="submit" className="card-button">
                Send Message
              </Button>
            </Box>
          </form>
        </Box>
      </Toolbar>
    </div>
  );
}

export default ContactMeComponent;
