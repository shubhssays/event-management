import React from "react";
import { Button } from "../../atoms/Button/Button";
import styles from "./CustomizeSection.module.css";
import { Icons } from "../../atoms/Icon/icon";
import clsx from "clsx";

export const CustomizeSection: React.FC = () => {
  return (
    <div className={styles.customizeSection}>
      <div className={styles.customizePreview}>
        <div className={styles.customizeContentTop}>
          <div className={styles.iconGrid}>
            <span className={styles.icon}>
              <Icons.ListBox />
            </span>
            <span className={clsx(styles.icon, styles.iconLeft)}>
              <Icons.SpeakerPhone />
            </span>
            <span className={styles.icon}>
              <Icons.Conference />
            </span>
          </div>

          <div className={styles.customizeText}>
            <h3>Customize your</h3>
            <h3>event your way</h3>
          </div>

          <div className={styles.iconGrid}>
            <span className={styles.icon}>
              <Icons.Clip />
            </span>
            <span className={clsx(styles.icon, styles.iconRight)}>
              <Icons.Photos />
            </span>
            <span className={styles.icon}>
              <Icons.Rsvp />
            </span>
          </div>
        </div>

        <div className={styles.customizeContentBottom}>
          <Button variant="secondary" fullWidth icon="🎨">
            Customize
          </Button>
        </div>
      </div>
    </div>
  );
};
