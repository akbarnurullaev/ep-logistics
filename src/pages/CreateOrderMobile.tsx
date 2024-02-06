import Box from "@mui/joy/Box";
import FormLabel, {formLabelClasses} from "@mui/joy/FormLabel";
import Stack from "@mui/joy/Stack";
import logo from "../assets/logo.png";
import * as React from "react";
import {useState} from "react";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Checkbox from "@mui/joy/Checkbox";
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import ColorSchemeToggle from "../components/ColorSchemeToggle.tsx";
import {useI18n} from "../logic/i18n.ts";
import {Alert, Autocomplete, DialogContent, DialogTitle} from "@mui/joy";
import {addPersistedOrder, Order} from "../logic/orders.ts";
import {companies} from "../logic/data.ts";
import {dateFormatter} from "../helpers/dateFormatter.ts";
import PlaylistAddCheckCircleRoundedIcon from "@mui/icons-material/PlaylistAddCheckCircleRounded";


interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormElements extends HTMLFormControlsCollection {
  productType: HTMLInputElement
  volume: HTMLInputElement
  clientName: HTMLInputElement
  deliveryDate: HTMLInputElement
  deliveryTime: HTMLInputElement
}
interface OrderFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}


export const CreateOrderMobile = () => {
  const {t, language} = useI18n();
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [successful, setSuccessful] = useState(false);

  if (successful) {
    return (
      <Alert
        sx={{ m: 2 }}
        variant="soft"
        color="success"
        startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
        // endDecorator={
        //   <Button size="sm" variant="solid" color="success">
        //     Close
        //   </Button>
        // }
      >
        {language === "en" ? "Your order was created successfully." : "Objednávka byla úspěšně vytvořena."}
      </Alert>
    );
  }

  if (showCreateOrder) {
    return <Box sx={{ p: 2 }}>
      <DialogTitle>{t("createNewOrder")}</DialogTitle>
      <DialogContent>{t("fillInTheInformationOfTheOrder")}</DialogContent>
      <form
        onSubmit={(event: React.FormEvent<OrderFormElement>) => {
          event.preventDefault();
          const formElements = event.currentTarget.elements;
          const data = {
            clientName: formElements.clientName.value,
            productType: formElements.productType.value,
            volume: +formElements.volume.value,
            deliveryDate: dateFormatter(new Date(formElements.deliveryDate.value)),
            deliveryTime: formElements.deliveryTime.value,
          } as Omit<Order, "id">;
          addPersistedOrder(data);
          setSuccessful(true);
        }}
      >
        <Stack sx={{ mt: 2 }} spacing={2}>
          <FormControl>
            <FormLabel>{t("clientName")}</FormLabel>
            <Autocomplete
              freeSolo
              name="clientName"
              options={companies.map((company) => company.name)}
              slotProps={{
                listbox: {
                  sx: {
                    zIndex: 2147483640
                  }
                }
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("productType")}</FormLabel>
            <Input name="productType" autoFocus required />
          </FormControl>
          <FormControl>
            <FormLabel>{t("volume")}</FormLabel>
            <Input name="volume" type="number" required />
          </FormControl>
          <FormControl>
            <FormLabel>{t("deliveryDate")}</FormLabel>
            <Input
              type="date"
              name="deliveryDate"
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("deliveryTime")}</FormLabel>
            <Input
              slotProps={{
                input: {
                  type: "time",
                  id: "appt",
                  name: "deliveryTime",
                  step: "3600"
                },
              }}
            />
          </FormControl>

          <Button type="submit">{t("createNewOrder")}</Button>
        </Stack>
      </form>
    </Box>;
  }

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
      ><ColorSchemeToggle />
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
        <Stack gap={4} sx={{mt: 2}}>
          <img
            style={{width: "60%", margin: "0 auto"}}
            src={logo}
            alt="Logo"
          />
          <form
            onSubmit={(event: React.FormEvent<SignInFormElement>) => {
              event.preventDefault();
              // const formElements = event.currentTarget.elements;
              // const data = {
              //   email: formElements.email.value,
              //   password: formElements.password.value,
              //   persistent: formElements.persistent.checked,
              // };
              setShowCreateOrder(true);
            }}
          >
            <FormControl required>
              <FormLabel>{t("email")}</FormLabel>
              <Input type="email" name="email"/>
            </FormControl>
            <FormControl required>
              <FormLabel>{t("password")}</FormLabel>
              <Input type="password" name="password"/>
            </FormControl>
            <Stack gap={4} sx={{mt: 2}}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Checkbox size="sm" label="Remember me" name="persistent"/>
                <Link level="title-sm" href="#replace-with-a-link">
                  {t("forgotYourPassword")}
                </Link>
              </Box>
              <Button type="submit" fullWidth>
                {t("signIn")}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
      <Box component="footer" sx={{py: 3}}>
        <Typography level="body-xs" textAlign="center">
              © EP Logistics {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
};