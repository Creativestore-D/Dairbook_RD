import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import BoxExamplesPage from "./layout/BoxExamplesPage";
import ContainerExamplesPage from "./layout/ContainerExamplesPage";
import GridExamplesPage from "./layout/GridExamplesPage";
import GridListExamplesPage from "./layout/GridListExamplesPage";
import HiddenExamplesPage from "./layout/HiddenExamplesPage";
import AutocompleteExamplesPage from "./inputs/AutocompleteExamplesPage";
import ButtonsExamplesPage from "./inputs/ButtonsExamplesPage";
import CheckboxesExamplesPage from "./inputs/CheckboxesExamplesPage";
import PickersExamplesPage from "./inputs/PickersExamplesPage";
import RadioButtonsExamplesPage from "./inputs/RadioButtonsExamplesPage";
import SelectsExamplesPage from "./inputs/SelectsExamplesPage";
import SwitchesExamplesPage from "./inputs/SwitchesExamplesPage";
import TextFieldsExamplesPage from "./inputs/TextFieldsExamplesPage";
import TransferListExamplesPage from "./inputs/TransferListExamplesPage";
import BottomNavigationExamplesPage from "./navigation/BottomNavigationExamplesPage";
import BreadcrumbsExamplesPage from "./navigation/BreadcrumbsExamplesPage";
import DrawerExamplesPage from "./navigation/DrawerExamplesPage";
import LinksExamplesPage from "./navigation/LinksExamplesPage";
import MenusExamplesPage from "./navigation/MenusExamplesPage";
import SteppersExamplesPage from "./navigation/SteppersExamplesPage";
import TabsExamplesPage from "./navigation/TabsExamplesPage";
import AppBarExamplesPage from "./surfaces/AppBarExamplesPage";
import PaperExamplesPage from "./surfaces/PaperExamplesPage";
import CardsExamplesPage from "./surfaces/CardsExamplesPage";
import ExpansionPanelsExamplesPage from "./surfaces/ExpansionPanelsExamplesPage";
import ProgressExamplesPage from "./feedback/ProgressExamplesPage";
import DialogsExamplesPage from "./feedback/DialogsExamplesPage";
import SnackbarsExamplesPage from "./feedback/SnackbarsExamplesPage";
import AvatarsExamplesPage from "./data-displays/AvatarsExamplesPage";
import BadgesExamplesPage from "./data-displays/BadgesExamplesPage";
import ChipsExamplesPage from "./data-displays/ChipsExamplesPage";
import DividersExamplesPage from "./data-displays/DividersExamplesPage";
import IconsExamplesPage from "./data-displays/IconsExamplesPage";
import ListsExamplesPage from "./data-displays/ListsExamplesPage";
import TablesExamplesPage from "./data-displays/TablesExamplesPage";
import TooltipsExamplesPage from "./data-displays/TooltipsExamplesPage";
import TypographyExamplesPage from "./data-displays/TypographyExamplesPage";
import ClickAwayListenerExamplesPage from "./utils/ClickAwayListenerExamplesPage";
import ModalExamplesPage from "./utils/ModalExamplesPage";
import NoSSRExamplesPage from "./utils/NoSSRExamplesPage";
import PopoverExamplesPage from "./utils/PopoverExamplesPage";
import PopperExamplesPage from "./utils/PopperExamplesPage";
import PortalExamplesPage from "./utils/PortalExamplesPage";
import TransitionsExamplesPage from "./utils/TransitionsExamplesPage";
import UseMediaQueryExamplesPage from "./utils/UseMediaQueryExamplesPage";
import SliderExamplesPage from "./labs/SliderExamplesPage";
import SpeedDialExamplesPage from "./labs/SpeedDialExamplesPage";
import ToggleButtonExamplesPage from "./labs/ToggleButtonExamplesPage";

export default function GoogleMaterialPage() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/admin/google-material"
        to="/admin/google-material/layout/box"
      />

      {/* Layout */}
      <Route 
        path="/admin/google-material/layout/box" 
        component={BoxExamplesPage} 
      />
      <Route
        path="/admin/google-material/layout/container"
        component={ContainerExamplesPage}
      />
      <Route 
        path="/admin/google-material/layout/grid" 
        component={GridExamplesPage} 
      />
      <Route
        path="/admin/google-material/layout/grid-list"
        component={GridListExamplesPage}
      />
      <Route
        path="/admin/google-material/layout/hidden"
        component={HiddenExamplesPage}
      />

      {/* Inputs */}
      <Route 
        path="/admin/google-material/inputs/autocomplete" 
        component={AutocompleteExamplesPage} 
      />
      <Route
        path="/admin/google-material/inputs/buttons"
        component={ButtonsExamplesPage}
      />
      <Route 
        path="/admin/google-material/inputs/checkboxes" 
        component={CheckboxesExamplesPage} 
      />
      <Route
        path="/admin/google-material/inputs/pickers"
        component={PickersExamplesPage}
      />
      <Route
        path="/admin/google-material/inputs/radio-buttons"
        component={RadioButtonsExamplesPage}
      />
      <Route
        path="/admin/google-material/inputs/selects"
        component={SelectsExamplesPage}
      />
      <Route 
        path="/admin/google-material/inputs/switches" 
        component={SwitchesExamplesPage} 
      />
      <Route
        path="/admin/google-material/inputs/text-fields"
        component={TextFieldsExamplesPage}
      />
      <Route
        path="/admin/google-material/inputs/transfer-list"
        component={TransferListExamplesPage}
      />

      {/* Navigation */}
      <Route
        path="/admin/google-material/navigation/bottom-navigation"
        component={BottomNavigationExamplesPage}
      />
      <Route
        path="/admin/google-material/navigation/breadcrumbs"
        component={BreadcrumbsExamplesPage}
      />
      <Route
        path="/admin/google-material/navigation/drawer"
        component={DrawerExamplesPage}
      />
      <Route
        path="/admin/google-material/navigation/links"
        component={LinksExamplesPage}
      />
      <Route
        path="/admin/google-material/navigation/menus"
        component={MenusExamplesPage}
      />
      <Route
        path="/admin/google-material/navigation/steppers"
        component={SteppersExamplesPage}
      />
      <Route
        path="/admin/google-material/navigation/tabs"
        component={TabsExamplesPage}
      />

      {/* Surfaces */}
      <Route
        path="/admin/google-material/surfaces/app-bar"
        component={AppBarExamplesPage}
      />
      <Route
        path="/admin/google-material/surfaces/paper"
        component={PaperExamplesPage}
      />
      <Route
        path="/admin/google-material/surfaces/cards"
        component={CardsExamplesPage}
      />
      <Route
        path="/admin/google-material/surfaces/expansion-panels"
        component={ExpansionPanelsExamplesPage}
      />

      {/* Feedback */}
      <Route
        path="/admin/google-material/feedback/progress"
        component={ProgressExamplesPage}
      />
      <Route
        path="/admin/google-material/feedback/dialogs"
        component={DialogsExamplesPage}
      />
      <Route
        path="/admin/google-material/feedback/snackbars"
        component={SnackbarsExamplesPage}
      />

      {/* Data Display */}
      <Route
        path="/admin/google-material/data-displays/avatars"
        component={AvatarsExamplesPage}
      />
      <Route
        path="/admin/google-material/data-displays/badges"
        component={BadgesExamplesPage}
      />
      <Route
        path="/admin/google-material/data-displays/chips"
        component={ChipsExamplesPage}
      />
      <Route
        path="/admin/google-material/data-displays/dividers"
        component={DividersExamplesPage}
      />
      <Route
        path="/admin/google-material/data-displays/icons"
        component={IconsExamplesPage}
      />
      <Route
        path="/admin/google-material/data-displays/lists"
        component={ListsExamplesPage}
      />
      <Route
        path="/admin/google-material/data-displays/tables"
        component={TablesExamplesPage}
      />
      <Route
        path="/admin/google-material/data-displays/tooltips"
        component={TooltipsExamplesPage}
      />
      <Route
        path="/admin/google-material/data-displays/typography"
        component={TypographyExamplesPage}
      />

      {/* Utils */}
      <Route
        path="/admin/google-material/utils/click-away-listener"
        component={ClickAwayListenerExamplesPage}
      />
      <Route
        path="/admin/google-material/utils/modal"
        component={ModalExamplesPage}
      />
      <Route
        path="/admin/google-material/utils/no-ssr"
        component={NoSSRExamplesPage}
      />
      <Route
        path="/admin/google-material/utils/popover"
        component={PopoverExamplesPage}
      />
      <Route
        path="/admin/google-material/utils/popper"
        component={PopperExamplesPage}
      />
      <Route
        path="/admin/google-material/utils/portal"
        component={PortalExamplesPage}
      />
      <Route
        path="/admin/google-material/utils/transitions"
        component={TransitionsExamplesPage}
      />
      <Route
        path="/admin/google-material/utils/use-media-query"
        component={UseMediaQueryExamplesPage}
      />

      {/* Lab */}
      <Route
        path="/admin/google-material/labs/slider"
        component={SliderExamplesPage}
      />
      <Route
        path="/admin/google-material/labs/speed-dial"
        component={SpeedDialExamplesPage}
      />
      <Route
        path="/admin/google-material/labs/toggle-button"
        component={ToggleButtonExamplesPage}
      />
    </Switch>
  );
}
