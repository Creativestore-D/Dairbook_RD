import React from "react";
import {Button, Form, Col, Tab, Tabs, Modal, Navbar, Nav, Dropdown} from "react-bootstrap";
import RUG from 'react-upload-gallery'
import {list, del, getToken, MEDIA_URL, API_URL} from "../crud/api";
import Gallery from 'react-grid-gallery';
import Select from 'react-select';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import Grid from "@material-ui/core/Grid";
import {lighten, makeStyles, withStyles} from '@material-ui/core/styles';
import {IconButton, Paper, Toolbar, Tooltip, Typography} from "@material-ui/core";
import clsx from "clsx";
import PropTypes from "prop-types";

const useStyles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    close: {
        padding: theme.spacing(0.5),
    },
    rootToolbar: {
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
        display: 'block',
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    title: {
        flex: '0 0 auto',
    },
});


class MediaLibrary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected_media_tab: (this.props.showLibrary ? 'my_library' : 'airbook_library'),
            selected_sort_col: '',
            selected_sort_type: '',
            galleryModal: false,
            user_media: [],
            airbook_media: [],
            meta_name: ''
        };
    }

    galleryModalOpener() {
        this.setState({galleryModal: true});
        if (this.props.showLibrary) {
            if (!this.state.user_media.length)
                this.getMedia('App\\User');
            else
                this.makeGallery(this.state.user_media);
        }

        if (!this.state.airbook_media.length)
            this.getMedia('Global');
        else
            this.makeGallery(this.state.airbook_media);

    }


    getMedia(media_type, search = null) {
        let filter = {mediable_type: media_type, mediableId: this.props.user}
        if (search != null)
            filter = {...filter, ...search}

        list('medias', filter).then(
            (response) => {
                let media_type = 'user';
                if (filter.mediable_type === 'Global')
                    media_type = 'airbook';

                this.setState({[media_type + '_media']: this.makeGallery(response.data),})
                this.isAnyImageSelected();
            });
    }


    makeGallery(data) {
        let selected_images = this.props.selected_images;
        let selected_img_names = [];
        selected_images.map((val, i) => {
            selected_img_names.push(val.original_file_name);
        })
        data.map((val, i) => {
            data[i].src = MEDIA_URL + val.original_file_name;
            data[i].thumbnail = MEDIA_URL + val.original_file_name;
            data[i].thumbnailWidth = 150;
            data[i].thumbnailHeight = 150;
            if (selected_img_names.indexOf(data[i].original_file_name) > -1)
                data[i].isSelected = true;
            else
                data[i].isSelected = false;
        })
        return data
    }

    searchMedia(val = null) {
        if (val === null)
            val = this.state.search;
        let selected_sort_type = this.state.selected_sort_type;
        let selected_sort_col = this.state.selected_sort_col;
        let media_type = this.state.selected_media_tab === 'my_library' ? 'App\\User' : 'Global';
        let filters = {search: val};
        if (selected_sort_col !== '') {
            if (selected_sort_type === '-')
                filters.ordering = selected_sort_type.value + selected_sort_col.value;
            else
                filters.ordering = selected_sort_col.value;
        }
        this.getMedia(media_type, filters);
    }

    selectImage(index, type) {
        let images = this.state[type + '_media'];
        images[index].isSelected = !images[index].isSelected;
        this.setState({[type + '_media']: images});
        this.isAnyImageSelected();
    }

    isAnyImageSelected() {
        let isAnySelected = false;
        let images = this.state.user_media;
        images.map((val, i) => {
            if (val.isSelected === true) {
                isAnySelected = true;
            }
        })
        images = this.state.airbook_media;
        images.map((val, i) => {
            if (val.isSelected === true) {
                isAnySelected = true;
            }
        })
        this.setState({isAnySelected: isAnySelected});
    }

    deletePhotos(type) {
        let media = this.state[type + '_media'];
        let selected_images = this.props.selected_images;
        let selected_img_ids = [];
        let selected_img_names = [];
        media = media.filter((val) => {
            if (val.isSelected) {
                selected_img_ids.push(val.id);
                selected_img_names.push(val.original_file_name);
                return false
            } else return true
        })
        selected_images = selected_images.filter((val) => {
            if (selected_img_names.indexOf(val.original_file_name) > -1)
                return false;
            else return true;
        })
        del('medias/' + selected_img_ids[0] + '/', {ids: selected_img_ids}).then(
            (response) => {
                this.setState({[type + '_media']: media, isAnySelected: false})
                if (this.props.showLibrary)
                    this.props.insertImages(selected_images)
            });
    }

    cancelSelection() {
        let selected_img_names = [];
        this.props.selected_images.map((val, i) => {
            selected_img_names.push(val.original_file_name);
        })
        let user_media = this.state.user_media;
        user_media.map((val, i) => {
            if (selected_img_names.indexOf(val.original_file_name) > -1)
                user_media[i].isSelected = true;
            else
                user_media[i].isSelected = false;
        })

        this.setState({user_media: user_media, galleryModal: false});
    }

    insertSelectedImages() {
        let user_media = this.state.user_media;
        let selected_images = [];
        user_media.map((value, index) => {
            if (value.isSelected) {
                let image = {};
                Object.keys(value).map((val, i) => {
                    image[val] = value[val];
                })
                image.customOverlay = <Grid item xs={8}><DeleteForeverOutlinedIcon/></Grid>;
                image.isSelected = false;
                selected_images.push(image);
            }
        })

        let airbook_media = this.state.airbook_media;
        airbook_media.map((value, index) => {
            if (value.isSelected) {
                let image = {};
                Object.keys(value).map((val, i) => {
                    image[val] = value[val];
                })
                image.customOverlay = <Grid item xs={8}><DeleteForeverOutlinedIcon/></Grid>;
                image.isSelected = false;
                selected_images.push(image);
            }
        })
        this.setState({galleryModal: false});
        if (this.props.showLibrary)
            this.props.insertImages(selected_images)
    }

    onImageUpload(image) {
        if (this.props.showLibrary) {
            document.getElementById('gallery-tabs-tab-my_library').click();
            this.getMedia('App\\User');
        } else {
            document.getElementById('gallery-tabs-tab-airbook_library').click();
            this.getMedia('Global');
        }
    }

    render() {
        const {selected_images, selected_media_tab, selected_sort_col, selected_sort_type} = this.state;
        const {classes} = this.props;
        return (
            <div>
                {this.props.modal ?
                    <Modal
                        size="xl"
                        show={this.state.galleryModal}
                        onHide={() => this.setState({galleryModal: false})}
                        aria-labelledby="example-modal-sizes-title-lg"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-lg">Media</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Navbar bg="light" style={{marginBottom: 0}}>
                                <Tab.Container id="gallery-tabs" defaultActiveKey={selected_media_tab}>
                                    <Form.Row style={{display: 'block', width: '100%'}}>
                                        <Col sm={12}>
                                            <Nav variant="pills">
                                                <Nav.Item>
                                                    <Nav.Link
                                                        onClick={() => this.setState({selected_media_tab: 'upload'})}
                                                        eventKey="upload">Upload</Nav.Link>
                                                </Nav.Item>
                                                {this.props.showLibrary ?
                                                    <Nav.Item>
                                                        <Nav.Link
                                                            onClick={() => this.setState({selected_media_tab: 'my_library'})}
                                                            eventKey="my_library">My Library</Nav.Link>
                                                    </Nav.Item> : ''}
                                                <Nav.Item>
                                                    <Nav.Link
                                                        onClick={() => this.setState({selected_media_tab: 'airbook_library'})}
                                                        eventKey="airbook_library">Airbook Gallery</Nav.Link>
                                                </Nav.Item>
                                                {selected_media_tab !== 'upload' ?
                                                    <Nav.Item className="pull-right" style={{marginLeft: 'auto'}}>
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            placeholder={selected_media_tab === 'airbook_library' ? 'search global images' : 'search my library'}
                                                            onChange={(e) => {
                                                                this.setState({search: e.target.value});
                                                                this.searchMedia(e.target.value)
                                                            }}
                                                        />
                                                    </Nav.Item> : ''}
                                            </Nav>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="upload">
                                                    {!this.props.showLibrary ?
                                                        <Form.Row>
                                                            <Form.Group as={Col} xs="12">
                                                                <Form.Control
                                                                    required
                                                                    type="text"
                                                                    placeholder="add suffix"
                                                                    onChange={(e) => this.setState({meta_name: e.target.value})}
                                                                />
                                                            </Form.Group>
                                                            <br/>
                                                        </Form.Row>
                                                        : ''}
                                                    {this.props.showLibrary || this.state.meta_name !== '' ?
                                                        <RUG
                                                            action={API_URL + "medias"}
                                                            headers={{'Authorization': 'Token ' + getToken()}}
                                                            send={
                                                                this.props.user !== undefined && this.props.user != '' ?
                                                                    {
                                                                        meta_name: this.state.meta_name,
                                                                        gallery: this.props.showLibrary ? 'user' : 'airbook',
                                                                        user: this.props.user
                                                                    }
                                                                    :
                                                                    {
                                                                        meta_name: this.state.meta_name,
                                                                        gallery: this.props.showLibrary ? 'user' : 'airbook'
                                                                    }
                                                            }
                                                            source={response => MEDIA_URL + response.original_file_name}
                                                            onSuccess={(image) => this.onImageUpload(image)}
                                                        /> : ''}
                                                </Tab.Pane>
                                                {this.props.showLibrary ?
                                                    <Tab.Pane eventKey="my_library">
                                                        <Form.Row>
                                                            <Col xl={9} md={8} sm={8} xs={12}>
                                                                <Gallery
                                                                    enableImageSelection={true}
                                                                    images={this.state.user_media}
                                                                    onSelectImage={(e) => this.selectImage(e, 'user')}
                                                                    enableLightbox={false}
                                                                    rowHeight={150}
                                                                />
                                                            </Col>
                                                            <Col xl={3} md={4} sm={4} xs={12}>
                                                                <Form.Group>
                                                                    <Form.Label>Sort By</Form.Label>
                                                                    <Select
                                                                        value={selected_sort_col}
                                                                        onChange={(val) => {
                                                                            this.setState({selected_sort_col: val});
                                                                            this.searchMedia()
                                                                        }}
                                                                        options={[
                                                                            {'label': '', 'value': ''},
                                                                            {'label': 'Name', 'value': 'meta_name'},
                                                                            {
                                                                                'label': 'Created At',
                                                                                'value': 'created_at'
                                                                            },
                                                                        ]}
                                                                    />
                                                                </Form.Group>
                                                                <Form.Group>
                                                                    <Form.Label>Sort By</Form.Label>
                                                                    <Select
                                                                        value={selected_sort_type}
                                                                        onChange={(val) => {
                                                                            this.setState({selected_sort_type: val});
                                                                            this.searchMedia()
                                                                        }}
                                                                        options={[
                                                                            {'label': '', 'value': ''},
                                                                            {'label': 'Ascending', 'value': '+'},
                                                                            {'label': 'Descending', 'value': '-'},
                                                                        ]}
                                                                    />
                                                                </Form.Group>
                                                                {this.state.isAnySelected ?
                                                                    <Button className="btn btn-danger btn-sm"
                                                                            onClick={(e) => this.deletePhotos('user')}>Delete
                                                                        Photo</Button> : ''}
                                                            </Col>
                                                        </Form.Row>
                                                    </Tab.Pane> : ''}
                                                <Tab.Pane eventKey="airbook_library">
                                                    <Form.Row>
                                                        <Col xl={9} md={8} sm={8} xs={12}>
                                                            <Gallery
                                                                enableImageSelection={true}
                                                                images={this.state.airbook_media}
                                                                onSelectImage={(e) => this.selectImage(e, 'airbook')}
                                                                enableLightbox={false}
                                                                rowHeight={150}
                                                            />
                                                        </Col>
                                                        <Col xl={3} md={4} sm={4} xs={12}>
                                                            <Form.Group>
                                                                <Form.Label>Sort By</Form.Label>
                                                                <Select
                                                                    value={selected_sort_col}
                                                                    onChange={(val) => {
                                                                        this.setState({selected_sort_col: val});
                                                                        this.searchMedia()
                                                                    }}
                                                                    options={[
                                                                        {'label': '', 'value': ''},
                                                                        {'label': 'Name', 'value': 'meta_name'},
                                                                        {'label': 'Created At', 'value': 'created_at'},
                                                                    ]}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group>
                                                                <Form.Label>Sort By</Form.Label>
                                                                <Select
                                                                    value={selected_sort_type}
                                                                    onChange={(val) => {
                                                                        this.setState({selected_sort_type: val});
                                                                        this.searchMedia()
                                                                    }}
                                                                    options={[
                                                                        {'label': '', 'value': ''},
                                                                        {'label': 'Ascending', 'value': '+'},
                                                                        {'label': 'Descending', 'value': '-'},
                                                                    ]}
                                                                />
                                                            </Form.Group>
                                                            {this.state.isAnySelected && !this.props.showLibrary ?
                                                                <Button className="btn btn-danger btn-sm"
                                                                        onClick={(e) => this.deletePhotos('airbook')}>Delete
                                                                    Photo</Button> : ''}
                                                        </Col>
                                                    </Form.Row>
                                                </Tab.Pane>
                                                {selected_media_tab !== 'upload' ?
                                                    <Form.Row>
                                                        <Col xs={12}>
                                                            <Button onClick={(e) => this.insertSelectedImages()}
                                                                    className="btn btn-primary btn-sm">Insert</Button>
                                                            &nbsp;&nbsp;&nbsp;
                                                            <Button onClick={() => this.cancelSelection()}
                                                                    className="btn btn-danger btn-sm">Cancel</Button>
                                                        </Col>
                                                    </Form.Row>
                                                    : ''
                                                }

                                            </Tab.Content>
                                        </Col>
                                    </Form.Row>
                                </Tab.Container>
                            </Navbar>

                        </Modal.Body>
                    </Modal> :
                    <div className={classes.root}>

                        <Paper className={classes.paper}>
                            <div className={classes.tableWrapper}>
                                <div className="kt-portlet kt-portlet--mobile">
                                    <Toolbar
                                        className={classes.rootToolbar}
                                    >
                                        <div className="kt-portlet__head kt-portlet__head--lg">
                                            <div className="kt-portlet__head-label">
											  <span className="kt-portlet__head-icon">
												<i className="kt-font-brand flaticon2-image-file"/>
											  </span>
                                                <h3 className="kt-portlet__head-title">
                                                    Media Gallery
                                                </h3>
                                            </div>
                                        </div>
                                    </Toolbar>
                                    <div className="kt-portlet__body">
                                        <Navbar bg="light" style={{marginBottom: 0}}>
                                            <Tab.Container id="gallery-tabs" defaultActiveKey={selected_media_tab}>
                                                <Form.Row style={{display: 'block', width: '100%'}}>
                                                    <Col sm={12}>
                                                        <Nav variant="pills">
                                                            <Nav.Item>
                                                                <Nav.Link
                                                                    onClick={() => this.setState({selected_media_tab: 'upload'})}
                                                                    eventKey="upload">Upload</Nav.Link>
                                                            </Nav.Item>
                                                            {this.props.showLibrary ?
                                                                <Nav.Item>
                                                                    <Nav.Link
                                                                        onClick={() => this.setState({selected_media_tab: 'my_library'})}
                                                                        eventKey="my_library">My Library</Nav.Link>
                                                                </Nav.Item> : ''}
                                                            <Nav.Item>
                                                                <Nav.Link
                                                                    onClick={() => this.setState({selected_media_tab: 'airbook_library'})}
                                                                    eventKey="airbook_library">Airbook
                                                                    Gallery</Nav.Link>
                                                            </Nav.Item>
                                                            {selected_media_tab !== 'upload' ?
                                                                <Nav.Item className="pull-right"
                                                                          style={{marginLeft: 'auto'}}>
                                                                    <Form.Control
                                                                        required
                                                                        type="text"
                                                                        placeholder={selected_media_tab === 'airbook_library' ? 'search global images' : 'search my library'}
                                                                        onChange={(e) => {
                                                                            this.setState({search: e.target.value});
                                                                            this.searchMedia(e.target.value)
                                                                        }}
                                                                    />
                                                                </Nav.Item> : ''}
                                                        </Nav>
                                                        <Tab.Content>
                                                            <Tab.Pane eventKey="upload">
                                                                {!this.props.showLibrary ?
                                                                    <Form.Row>
                                                                        <Form.Group as={Col} xs="12">
                                                                            <Form.Control
                                                                                required
                                                                                type="text"
                                                                                placeholder="add suffix"
                                                                                onChange={(e) => this.setState({meta_name: e.target.value})}
                                                                            />
                                                                        </Form.Group>
                                                                        <br/>
                                                                    </Form.Row>
                                                                    : ''}
                                                                {this.props.showLibrary || this.state.meta_name !== '' ?
                                                                    <RUG
                                                                        action={API_URL + "medias"}
                                                                        headers={{'Authorization': 'Token ' + getToken()}}
                                                                        send={
                                                                            this.props.user !== undefined && this.props.user != '' ?
                                                                                {
                                                                                    meta_name: this.state.meta_name,
                                                                                    gallery: this.props.showLibrary ? 'user' : 'airbook',
                                                                                    user: this.props.user
                                                                                }
                                                                                :
                                                                                {
                                                                                    meta_name: this.state.meta_name,
                                                                                    gallery: this.props.showLibrary ? 'user' : 'airbook'
                                                                                }
                                                                        }
                                                                        source={response => MEDIA_URL + response.original_file_name}
                                                                        onSuccess={(image) => this.onImageUpload(image)}
                                                                    /> : ''}
                                                            </Tab.Pane>
                                                            {this.props.showLibrary ?
                                                                <Tab.Pane eventKey="my_library">
                                                                    <Form.Row>
                                                                        <Col xl={10} md={8} sm={8} xs={12}>
                                                                            <Gallery
                                                                                enableImageSelection={true}
                                                                                images={this.state.user_media}
                                                                                onSelectImage={(e) => this.selectImage(e, 'user')}
                                                                                enableLightbox={false}
                                                                                rowHeight={150}
                                                                            />
                                                                        </Col>
                                                                        <Col xl={2} md={4} sm={4} xs={12}>
                                                                            <Form.Group>
                                                                                <Form.Label>Sort By</Form.Label>
                                                                                <Select
                                                                                    value={selected_sort_col}
                                                                                    onChange={(val) => {
                                                                                        this.setState({selected_sort_col: val});
                                                                                        this.searchMedia()
                                                                                    }}
                                                                                    options={[
                                                                                        {'label': '', 'value': ''},
                                                                                        {
                                                                                            'label': 'Name',
                                                                                            'value': 'meta_name'
                                                                                        },
                                                                                        {
                                                                                            'label': 'Created At',
                                                                                            'value': 'created_at'
                                                                                        },
                                                                                    ]}
                                                                                />
                                                                            </Form.Group>
                                                                            <Form.Group>
                                                                                <Form.Label>Sort By</Form.Label>
                                                                                <Select
                                                                                    value={selected_sort_type}
                                                                                    onChange={(val) => {
                                                                                        this.setState({selected_sort_type: val});
                                                                                        this.searchMedia()
                                                                                    }}
                                                                                    options={[
                                                                                        {'label': '', 'value': ''},
                                                                                        {
                                                                                            'label': 'Ascending',
                                                                                            'value': '+'
                                                                                        },
                                                                                        {
                                                                                            'label': 'Descending',
                                                                                            'value': '-'
                                                                                        },
                                                                                    ]}
                                                                                />
                                                                            </Form.Group>
                                                                            {this.state.isAnySelected ?
                                                                                <Button
                                                                                    className="btn btn-danger btn-sm"
                                                                                    onClick={(e) => this.deletePhotos('user')}>Delete
                                                                                    Photo</Button> : ''}
                                                                        </Col>
                                                                    </Form.Row>
                                                                </Tab.Pane> : ''}
                                                            <Tab.Pane eventKey="airbook_library">
                                                                <Form.Row>
                                                                    <Col xl={10} md={8} sm={8} xs={12}>
                                                                        <Gallery
                                                                            enableImageSelection={true}
                                                                            images={this.state.airbook_media}
                                                                            onSelectImage={(e) => this.selectImage(e, 'airbook')}
                                                                            enableLightbox={false}
                                                                            rowHeight={150}
                                                                        />
                                                                    </Col>
                                                                    <Col xl={2} md={4} sm={4} xs={12}>
                                                                        <Form.Group>
                                                                            <Form.Label>Sort By</Form.Label>
                                                                            <Select
                                                                                value={selected_sort_col}
                                                                                onChange={(val) => {
                                                                                    this.setState({selected_sort_col: val});
                                                                                    this.searchMedia()
                                                                                }}
                                                                                options={[
                                                                                    {'label': '', 'value': ''},
                                                                                    {
                                                                                        'label': 'Name',
                                                                                        'value': 'meta_name'
                                                                                    },
                                                                                    {
                                                                                        'label': 'Created At',
                                                                                        'value': 'created_at'
                                                                                    },
                                                                                ]}
                                                                            />
                                                                        </Form.Group>
                                                                        <Form.Group>
                                                                            <Form.Label>Sort By</Form.Label>
                                                                            <Select
                                                                                value={selected_sort_type}
                                                                                onChange={(val) => {
                                                                                    this.setState({selected_sort_type: val});
                                                                                    this.searchMedia()
                                                                                }}
                                                                                options={[
                                                                                    {'label': '', 'value': ''},
                                                                                    {
                                                                                        'label': 'Ascending',
                                                                                        'value': '+'
                                                                                    },
                                                                                    {
                                                                                        'label': 'Descending',
                                                                                        'value': '-'
                                                                                    },
                                                                                ]}
                                                                            />
                                                                        </Form.Group>
                                                                        {this.state.isAnySelected && !this.props.showLibrary ?
                                                                            <Button className="btn btn-danger btn-sm"
                                                                                    onClick={(e) => this.deletePhotos('airbook')}>Delete
                                                                                Photo</Button> : ''}
                                                                    </Col>
                                                                </Form.Row>
                                                            </Tab.Pane>
                                                        </Tab.Content>
                                                    </Col>
                                                </Form.Row>
                                            </Tab.Container>
                                        </Navbar>
                                    </div>
                                </div>
                            </div>
                        </Paper>
                    </div>
                }
            </div>
        )
    }
}

export default withStyles(useStyles)(MediaLibrary)