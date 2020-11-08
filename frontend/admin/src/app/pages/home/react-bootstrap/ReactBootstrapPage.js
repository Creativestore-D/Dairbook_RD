import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import AccordionExamplesPage from "./AccordionExamplesPage";
import AlertExamplesPage from "./AlertExamplesPage";
import BadgeExamplesPage from "./BadgeExamplesPage";
import BreadcrumbExamplesPage from "./BreadcrumbExamplesPage";
import ButtonsExamplesPage from "./ButtonsExamplesPage";
import ButtonGroupExamplesPage from "./ButtonGroupExamplesPage";
import CardsExamplesPage from "./CardsExamplesPage";
import CarouselExamplesPage from "./CarouselExamplesPage";
import DropdownsExamplesPage from "./DropdownsExamplesPage";
import FormsExamplesPage from "./FormsExamplesPage";
import InputGroupExamplesPage from "./InputGroupExamplesPage";
import ImagesExamplesPage from "./ImagesExamplesPage";
import FiguresExamplesPage from "./FiguresExamplesPage";
import JumbotronExamplesPage from "./JumbotronExamplesPage";
import ListGroupExamplesPage from "./ListGroupExamplesPage";
import ModalExamplesPage from "./ModalExamplesPage";
import NavsExamplesPage from "./NavsExamplesPage";
import NavbarExamplesPage from "./NavbarExamplesPage";
import OverlaysExamplesPage from "./OverlaysExamplesPage";
import PaginationExamplesPage from "./PaginationExamplesPage";
import PopoversExamplesPage from "./PopoversExamplesPage";
import ProgressExamplesPage from "./ProgressExamplesPage";
import SpinnersExamplesPage from "./SpinnersExamplesPage";
import TableExamplesPage from "./TableExamplesPage";
import TabsExamplesPage from "./TabsExamplesPage";
import TooltipsExamplesPage from "./TooltipsExamplesPage";
import ToastsExamplesPage from "./ToastsExamplesPage";


export default function ReactBootstrapPage() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/admin/react-bootstrap"
        to="/admin/react-bootstrap/accordion"
      />

      <Route 
        path="/admin/react-bootstrap/accordion" 
        component={AccordionExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/alert" 
        component={AlertExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/badge" 
        component={BadgeExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/breadcrumb" 
        component={BreadcrumbExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/buttons" 
        component={ButtonsExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/button-group" 
        component={ButtonGroupExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/cards" 
        component={CardsExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/carousel" 
        component={CarouselExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/dropdowns" 
        component={DropdownsExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/forms" 
        component={FormsExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/input-group" 
        component={InputGroupExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/images" 
        component={ImagesExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/figures" 
        component={FiguresExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/jumbotron" 
        component={JumbotronExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/list-group" 
        component={ListGroupExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/modal" 
        component={ModalExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/navs" 
        component={NavsExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/navbar" 
        component={NavbarExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/overlays" 
        component={OverlaysExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/pagination" 
        component={PaginationExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/popovers" 
        component={PopoversExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/progress" 
        component={ProgressExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/spinners" 
        component={SpinnersExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/table" 
        component={TableExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/tabs" 
        component={TabsExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/tooltips" 
        component={TooltipsExamplesPage} 
      />
      <Route 
        path="/admin/react-bootstrap/toasts" 
        component={ToastsExamplesPage} 
      />

    </Switch>
  );
}
