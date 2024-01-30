import * as React from "react";
import {useColorScheme} from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import FormControl from "@mui/joy/FormControl";
import FormLabel, {formLabelClasses} from "@mui/joy/FormLabel";
import IconButton, {IconButtonProps} from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import {useAuth} from "../providers/AuthContext.tsx";

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="neutral" disabled />;
  }
  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      aria-label="toggle light/dark mode"
      {...other}
      onClick={(event) => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
        onClick?.(event);
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function Auth() {
  const auth = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        width:
              "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
        maxWidth: "100%",
        px: 2,
      }}
    >
      <Box
        component="header"
        sx={{
          py: 3,
          display: "flex",
          alignItems: "left",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
          <IconButton variant="soft" color="primary" size="sm">
            <BadgeRoundedIcon />
          </IconButton>
          <Typography level="title-lg">EP Logistics</Typography>
        </Box>
        <ColorSchemeToggle />
      </Box>
      <Box
        component="main"
        sx={{
          my: "auto",
          py: 2,
          pb: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 400,
          maxWidth: "100%",
          mx: "auto",
          borderRadius: "sm",
          "& form": {
            display: "flex",
            flexDirection: "column",
            gap: 2,
          },
          [`& .${formLabelClasses.asterisk}`]: {
            visibility: "hidden",
          },
        }}
      >
        <Stack gap={4} sx={{ mt: 2 }}>
          <form
            onSubmit={(event: React.FormEvent<SignInFormElement>) => {
              event.preventDefault();
              auth?.setAuthToken("token");
              console.log("edwed");
              // const formElements = event.currentTarget.elements;
              // const data = {
              //   email: formElements.email.value,
              //   password: formElements.password.value,
              //   persistent: formElements.persistent.checked,
              // };
              // alert(JSON.stringify(data, null, 2));
            }}
          >
            <FormControl required>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" />
            </FormControl>
            <FormControl required>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" />
            </FormControl>
            <Stack gap={4} sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Checkbox size="sm" label="Remember me" name="persistent" />
                <Link level="title-sm" href="#replace-with-a-link">
                      Forgot your password?
                </Link>
              </Box>
              <Button type="submit" fullWidth>
                    Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
      <Box component="footer" sx={{ py: 3 }}>
        <Typography level="body-xs" textAlign="center">
              © EP Logistics {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}