import React from 'react';
import { useRecoilValue } from 'recoil';
import { backgroundImageAtom } from '../../store/eventStore';
import { FlyerSection } from '../../components/organisms/FlyerSection/FlyerSection';
import { EventForm } from '../../components/organisms/EventForm/EventForm';
import styles from './CreateEvent.module.css';

export const CreateEvent: React.FC = () => {
  const backgroundImage = useRecoilValue(backgroundImageAtom);

  return (
    <div 
      className={styles.container}
      style={{
        backgroundImage: backgroundImage 
          ? `url(${backgroundImage.url})` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className={styles.overlay} />
      
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <h1 className={styles.logo}>let's hang</h1>
          <nav className={styles.nav}>
            <a href="/" className={styles.navLink}>Home</a>
            <a href="/people" className={styles.navLink}>People</a>
            <a href="/search" className={styles.navLink}>Search</a>
          </nav>
        </div>
        <button className={styles.signIn}>Sign in</button>
      </header>

      <main className={styles.main} style={{width: "100%"}}>
        <div className={styles.content}>
          <div className={styles.flyerColumn}>
            <FlyerSection />
          </div>
          <div className={styles.formColumn}>
            <EventForm />
          </div>
        </div>
      </main>
    </div>
  );
};
