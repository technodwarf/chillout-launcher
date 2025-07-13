import { MutableRefObject, useEffect, useRef } from 'react';
import { IdleAnimation, SkinViewer, createOrbitControls } from 'skinview3d';

import defaultSkin from '../assets/images/steve.png';

export default function SkinView() {
    const skinCanvas = useRef() as MutableRefObject<HTMLCanvasElement>;

    useEffect(() => {
        const skinViewer = new SkinViewer({
            canvas: skinCanvas.current,
            width: 220,
            height: 440,
        });

        skinViewer.camera.position.x = -20;
        skinViewer.camera.position.y = 20;
        skinViewer.zoom = 0.8;

        skinViewer.animations.add(IdleAnimation);

        const control = createOrbitControls(skinViewer);
        control.enableZoom = false;

        // Поддержка загрузки и отображения скина
        const { skinUrl, capeUrl, isAlex, userUUID } = JSON.parse(
            localStorage.getItem('userData') || '{}',
        );

        const mySkinUrl = 'http://localhost/api/user/skin?uuid=' + userUUID;

        console.log(mySkinUrl);
        if (skinUrl) {
            skinViewer.loadSkin(skinUrl);
        } else {
            skinViewer.loadSkin(defaultSkin);
            skinViewer.loadSkin(mySkinUrl);
            // Fuck skinview (race condition moment)
        }
        if (capeUrl) skinViewer.loadCape(capeUrl);
        if (isAlex) skinViewer.playerObject.skin.modelType = 'slim';
    }, []);

    return <canvas ref={skinCanvas} />;
}
