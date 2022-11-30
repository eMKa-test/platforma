import React, { useEffect, useRef, useState } from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import PlaceHolder from "../../../common/PlaceHolder";
import galleryJSS from "./styles";
import ShareButton from "../../common/buttons/share";

function ThumbnailCard(props) {
    const {
        classes, item, idx, onSelectImage, width,
    } = props;
    const [loaded, setLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    const imageRef = useRef(null);

    useEffect(() => {
        let observer;
        let didCancel = false;

        if (imageRef.current && imageSrc !== item.src.tmb) {
            if (IntersectionObserver) {
                observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (!didCancel && (entry.intersectionRatio > 0 || entry.isIntersecting)) {
                                setImageSrc(item.src.tmb);
                                observer.unobserve(imageRef.current);
                            }
                        });
                    }, {
                        threshold: 0.01,
                        root: null,
                    },
                );
                observer.observe(imageRef.current);
            } else {
                setImageSrc(item.src.tmb);
            }
        }
        return () => {
            didCancel = true;
            if (observer && observer.unobserve) {
                observer.unobserve(imageRef.current);
                observer.disconnect();
            }
        };
    }, [item.src.tmb, imageSrc, imageRef]);

    return (
        <div
            ref={imageRef}
            data-test="gallery-tmb-wrapper"
            className={classes.tmbWrapper}
            style={{
                flex: `0 0 ${width}`,
            }}
            onClick={() => onSelectImage(idx)}>
            <div className={classes.item}>
                {!loaded ? (
                    <div className={classes.imageLoader}>
                        <img
                            onLoad={() => setLoaded(true)}
                            src={imageSrc}
                            alt="" />
                    </div>
                ) : null}
                <PlaceHolder
                    type={item.type}
                    hide={loaded} />
                <div className={classes.gradient} />
                <div
                    className={classes.tmbImage}
                    style={{
                        opacity: loaded ? 1 : 0,
                        backgroundImage: `url(${imageSrc})`,
                        backgroundPosition: "center center",
                    }} />
                {item.description ? (
                    <div className={classes.description}>
                        {item.description}
                    </div>
                ) : null}
                <div className={classes.share}>
                    <ShareButton
                        source={item.src.src}
                        mediaType={item.type} />
                </div>
            </div>
        </div>
    );
}

ThumbnailCard.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
    onSelectImage: PropTypes.func.isRequired,
    width: PropTypes.string.isRequired,
};

export default withStyles(galleryJSS)(ThumbnailCard);
