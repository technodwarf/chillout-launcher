import { MutableRefObject, useEffect, useRef } from 'react';
import { IdleAnimation, SkinViewer } from 'skinview3d';

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
        skinViewer.zoom = 0.6;

        skinViewer.controls.enableZoom = true;
        
        // Поддержка загрузки и отображения скина
        const { skinUrl, capeUrl, isAlex, userUUID, username } = JSON.parse(
            localStorage.getItem('userData') || '{}',
        );

        skinViewer.nameTag = username;

        const mySkinUrl = 'http://localhost/api/user/skin?uuid=' + userUUID;

        if (skinUrl) {
            skinViewer.loadSkin(skinUrl);
        } else {
            // skinViewer.loadSkin(defaultSkin);
            skinViewer.loadSkin(mySkinUrl);
            // Fuck skinview (race condition moment)
        }
        if (capeUrl) skinViewer.loadCape(capeUrl);
        if (isAlex) skinViewer.playerObject.skin.modelType = 'slim';

        skinViewer.animation = new IdleAnimation();
    }, []);

    return <canvas ref={skinCanvas} />;
}
