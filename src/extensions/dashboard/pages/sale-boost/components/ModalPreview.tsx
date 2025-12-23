import type { FC } from "react";
import { Card } from "@wix/design-system";
import { useSaleBoost, useSaleBoostPreview } from "../context/SaleBoostContext";

export const ModalPreviewCard: FC = () => {
  const { isPremium } = useSaleBoost();
  const config = useSaleBoostPreview();

  return (
    <Card>
      <Card.Header title="Preview" />
      <Card.Content>
        <ModalPreviewContent config={config} isPremium={isPremium} />
      </Card.Content>
    </Card>
  );
};

interface PreviewProps {
  config: {
    header: string;
    body: string;
    buttonLabel: string;
    textColor: string;
    buttonColor: string;
    imageUrl: string;
    showCloseButton: string;
  };
  isPremium: boolean;
}

const ModalPreviewContent: FC<PreviewProps> = ({ config, isPremium }) => {
  const showImage = isPremium && Boolean(config.imageUrl);
  const showClose = config.showCloseButton === "1";

  const styles: Record<string, React.CSSProperties> = {
    modal: {
      backgroundColor: "#ffffff",
      borderRadius: 12,
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      fontFamily: "Arial, Helvetica, sans-serif",
    },

    closeButton: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 32,
      height: 32,
      borderRadius: "50%",
      border: "none",
      backgroundColor: "#ffffff",
      fontSize: 18,
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      lineHeight: "32px",
    },

    imageWrapper: {
      width: "100%",
      maxHeight: "380px",
    },

    image: {
      width: "100%",
      display: "block",
      maxHeight: "380px",
    },

    content: {
      padding: 24,
      textAlign: "center",
    },

    header: {
      fontSize: 22,
      fontWeight: 700,
      marginBottom: 12,
    },

    body: {
      fontSize: 14,
      color: "#666",
      marginBottom: 20,
      lineHeight: 1.5,
    },

    button: {
      color: "#ffffff",
      border: "none",
      padding: "14px 20px",
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer",
      textTransform: "uppercase",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    },
  };

  return (
    <div style={styles.modal}>
      {showClose && (
        <button style={styles.closeButton} onClick={() => {}}>
          ×
        </button>
      )}

      {showImage && (
        <div style={styles.imageWrapper}>
          <img src={config.imageUrl} alt="Sale" style={styles.image} />
        </div>
      )}

      <div style={styles.content}>
        <h2 style={{ ...styles.header, color: config.textColor }}>
          {config.header}
        </h2>

        <p style={styles.body}>{config.body}</p>

        <button
          style={{
            ...styles.button,
            backgroundColor: config.buttonColor,
          }}
          onClick={() => {}}
        >
          {config.buttonLabel}
        </button>
      </div>
    </div>
  );
};
