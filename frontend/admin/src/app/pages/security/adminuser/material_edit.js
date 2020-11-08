/* eslint-disable no-restricted-imports */
import React from "react";
import clsx from "clsx";
import Notice from "../../../partials/content/Notice";
import CodeExample from "../../../partials/content/CodeExample";
import {
  TextField,
  MenuItem,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  OutlinedInput,
  FilledInput,
  InputBase,
  Paper,
  IconButton,
  Divider,
  InputAdornment,
  Grid
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme
} from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AccountCircle from "@material-ui/icons/AccountCircle";

const currencies = [
  {
    value: "USD",
    label: "$"
  },
  {
    value: "EUR",
    label: "€"
  },
  {
    value: "BTC",
    label: "฿"
  },
  {
    value: "JPY",
    label: "¥"
  }
];

// Example 2
const useStyles2 = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  menu: {
    width: 200
  }
}));


export default function TextFieldsExamplesPage() {

  // Example 2
  const classes2 = useStyles2();
  const [values2, setValues2] = React.useState({
    name: "Cat in the Hat",
    age: "",
    multiline: "Controlled",
    currency: "EUR"
  });

  const handleChange2 = name => event => {
    setValues2({ ...values2, [name]: event.target.value });
  };

  return (
    <>
      <Notice icon="flaticon-warning kt-font-primary">
        <p>Text fields let users enter and edit text.</p>
        <p>
          For more info please check the components's official{" "}
          <a
            target="_blank"
            className="kt-link"
            rel="noopener noreferrer"
            href="https://material-ui.com/components/text-fields/"
          >
            demos & documentation
          </a>
        </p>
      </Notice>
      <CodeExample beforeCodeTitle="Outlined">
        <div className="kt-section">
          <span className="kt-section__sub">
            <code>TextField</code> supports outlined styling.
          </span>
          <div className="kt-separator kt-separator--dashed"></div>
          <div className="kt-section__content">
            <form className={classes2.container} noValidate autoComplete="off">
              <TextField
                id="outlined-name"
                label="Name"
                className={classes2.textField}
                value={values2.name}
                onChange={handleChange2("name")}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-uncontrolled"
                label="Uncontrolled"
                defaultValue="foo"
                className={classes2.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                required
                id="outlined-required"
                label="Required"
                defaultValue="Hello World"
                className={classes2.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                error
                id="outlined-error"
                label="Error"
                defaultValue="Hello World"
                className={classes2.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                disabled
                id="outlined-disabled"
                label="Disabled"
                defaultValue="Hello World"
                className={classes2.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-email-input"
                label="Email"
                className={classes2.textField}
                type="email"
                name="email"
                autoComplete="email"
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-password-input"
                label="Password"
                className={classes2.textField}
                type="password"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-read-only-input"
                label="Read Only"
                defaultValue="Hello World"
                className={classes2.textField}
                margin="normal"
                InputProps={{
                  readOnly: true
                }}
                variant="outlined"
              />
              <TextField
                id="outlined-dense"
                label="Dense"
                className={clsx(classes2.textField, classes2.dense)}
                margin="dense"
                variant="outlined"
              />
              <TextField
                id="outlined-dense-multiline"
                label="Dense multiline"
                className={clsx(classes2.textField, classes2.dense)}
                margin="dense"
                variant="outlined"
                multiline
                rowsMax="4"
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Multiline"
                multiline
                rowsMax="4"
                value={values2.multiline}
                onChange={handleChange2("multiline")}
                className={classes2.textField}
                margin="normal"
                helperText="hello"
                variant="outlined"
              />
              <TextField
                id="outlined-multiline-static"
                label="Multiline"
                multiline
                rows="4"
                defaultValue="Default Value"
                className={classes2.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-helperText"
                label="Helper text"
                defaultValue="Default Value"
                className={classes2.textField}
                helperText="Some important text"
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-with-placeholder"
                label="With placeholder"
                placeholder="Placeholder"
                className={classes2.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-textarea"
                label="Multiline Placeholder"
                placeholder="Placeholder"
                multiline
                className={classes2.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-number"
                label="Number"
                value={values2.age}
                onChange={handleChange2("age")}
                type="number"
                className={classes2.textField}
                InputLabelProps={{
                  shrink: true
                }}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-search"
                label="Search field"
                type="search"
                className={classes2.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-select-currency"
                select
                label="Select"
                className={classes2.textField}
                value={values2.currency}
                onChange={handleChange2("currency")}
                SelectProps={{
                  MenuProps: {
                    className: classes2.menu
                  }
                }}
                helperText="Please select your currency"
                margin="normal"
                variant="outlined"
              >
                {currencies.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="outlined-select-currency-native"
                select
                label="Native select"
                className={classes2.textField}
                value={values2.currency}
                onChange={handleChange2("currency")}
                SelectProps={{
                  native: true,
                  MenuProps: {
                    className: classes2.menu
                  }
                }}
                helperText="Please select your currency"
                margin="normal"
                variant="outlined"
              >
                {currencies.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
              <TextField
                id="outlined-full-width"
                label="Label"
                style={{ margin: 8 }}
                placeholder="Placeholder"
                helperText="Full width!"
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                id="outlined-bare"
                className={classes2.textField}
                defaultValue="Bare"
                margin="normal"
                variant="outlined"
                inputProps={{ "aria-label": "bare" }}
              />
            </form>
          </div>
        </div>
      </CodeExample>
    </>
  );
}

