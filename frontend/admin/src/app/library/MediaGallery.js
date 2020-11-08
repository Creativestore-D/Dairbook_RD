import MediaLibrary from './media'
import React from "react";

export default class MediaGallery extends React.Component {
	constructor(props) {
	    super(props);
	    this.medialibrary = React.createRef();
	}
	componentDidMount() {
	    this.medialibrary.current.galleryModalOpener()
	}
	
	render() {
		return (
        	<MediaLibrary modal={false} showLibrary={false} ref={this.medialibrary} selected_images={[]} />
		)
	}
}