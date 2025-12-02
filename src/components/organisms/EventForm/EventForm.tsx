import React, { useEffect, useState, useRef } from "react";
import { useEventStore } from "../../../store/eventStore";
import {
  useSaveEventDraft,
  usePublishEvent,
  useValidateEvent,
} from "../../../hooks/useEventQueries";
import { useToast } from "../../../store/toastStore";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { FormInput } from "../../molecules/FormInput/FormInput";
import { QuickLinksPanel } from "../QuickLinksPanel/QuickLinksPanel";
import { CustomizeSection } from "../CustomizeSection/CustomizeSection";
import { Button } from "../../atoms/Button/Button";
import styles from "./EventForm.module.css";

export const EventForm: React.FC = () => {
  const { eventForm, flyerImage, backgroundImage, draftId, setEventForm } = useEventStore();

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showConfirmPublish, setShowConfirmPublish] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimerRef = useRef<number | null>(null);

  // React Query hooks
  const { mutate: saveDraft } = useSaveEventDraft();
  const { mutate: publishEvent, isPending: isPublishing } = usePublishEvent();
  const { mutateAsync: validateEvent } = useValidateEvent();

  const toast = useToast();

  const handleChange = (field: string, value: string) => {
    setEventForm({ [field]: value });
    // Clearing validation error
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Automatically saving with 500ms debounce - for all fields
  useEffect(() => {
    // Clearing existing timer if exists
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // saving automatically only when we have some data
    const hasData =
      eventForm.title ||
      eventForm.phoneNumber ||
      eventForm.dateTime ||
      eventForm.location ||
      eventForm.description;

    if (hasData) {
      autoSaveTimerRef.current = setTimeout(() => {
        setIsSaving(true);
        saveDraft(
          {
            ...eventForm,
            draftId: draftId || undefined,
            flyerImageUrl: flyerImage?.url,
            backgroundImageUrl: backgroundImage?.url,
          },
          {
            onSuccess: () => {
              setLastSaved(new Date());
              setIsSaving(false);
            },
            onError: () => {
              setIsSaving(false);
              toast.error(
                "Failed to save draft",
                {
                  label: "Retry",
                  onClick: () => {
                    saveDraft({
                      ...eventForm,
                      draftId: draftId || undefined,
                      flyerImageUrl: flyerImage?.url,
                      backgroundImageUrl: backgroundImage?.url,
                    });
                  },
                },
                0 // Preventing auto dismissal
              );
            },
          }
        );
      }, 500); // 500ms debounce
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventForm, flyerImage, backgroundImage, draftId]);

  const handleGoLive = async () => {
    try {
      // validating inputs
      const errors: Record<string, string> = {};

      if (!eventForm.title?.trim()) {
        errors.title = "Event title is required";
      }
      if (!eventForm.dateTime?.trim()) {
        errors.dateTime = "Date and time is required";
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error("Please fill in all required fields");
        return;
      }

      const validation = await validateEvent(eventForm);

      if (!validation.valid) {
        const errorMap: Record<string, string> = {};
        validation.errors.forEach((e: { field: string; message: string }) => {
          errorMap[e.field] = e.message;
        });
        setValidationErrors(errorMap);
        toast.error("Please fix validation errors before publishing");
        return;
      }

      if (validation.warnings.length > 0) {
        const warningMessages = validation.warnings
          .map((w: { message: string }) => w.message)
          .join(", ");
        toast.warning(warningMessages, 5000);
      }

      // Showing confirmation modal
      setShowConfirmPublish(true);
    } catch (error) {
      console.error("Validation error:", error);
      toast.error(error instanceof Error ? error.message : "Validation failed");
    }
  };

  const handleConfirmPublish = () => {
    publishEvent(
      {
        ...eventForm,
        draftId: draftId || undefined,
        flyerImageUrl: flyerImage?.url,
        backgroundImageUrl: backgroundImage?.url,
      },
      {
        onSuccess: (result) => {
          setShowConfirmPublish(false);
          toast.success(
            `Event published successfully! URL: ${result.eventUrl}`,
            5000
          );
        },
        onError: (error) => {
          console.error("Failed to publish event:", error);
          setShowConfirmPublish(false);
          toast.error(
            error instanceof Error ? error.message : "Failed to publish event",
            {
              label: "Retry",
              onClick: handleConfirmPublish,
            },
            0
          );
        },
      }
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className={styles.formSection}>
      <h2 className={styles.title}>Name your event</h2>

      <div className={styles.inputGroup}>
        {eventForm.phoneNumber && (
          <label className={styles.inputLabel}>Phone Number</label>
        )}
        <FormInput
          icon="💾"
          placeholder="Enter phone number to save the draft"
          value={eventForm.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          type="tel"
          className={styles.phoneInput}
          actionButton={{
            icon: "→",
            onClick: () => {
              // Checking if there is any data to save
              const hasData =
                eventForm.title ||
                eventForm.phoneNumber ||
                eventForm.dateTime ||
                eventForm.location ||
                eventForm.costPerPerson ||
                eventForm.description;

              if (!hasData) {
                toast.warning("Please enter some information before saving");
                return;
              }

              setIsSaving(true);
              saveDraft(
                {
                  ...eventForm,
                  draftId: draftId || undefined,
                  flyerImageUrl: flyerImage?.url,
                  backgroundImageUrl: backgroundImage?.url,
                },
                {
                  onSuccess: () => {
                    setLastSaved(new Date());
                    setIsSaving(false);
                    toast.success("Draft saved successfully!");
                  },
                  onError: () => {
                    setIsSaving(false);
                    toast.error("Failed to save draft. Please try again.");
                  },
                }
              );
            },
            ariaLabel: "Save draft",
          }}
        />
      </div>


      <div className={styles.statusBar}>
        {isSaving && (
          <span className={styles.savingIndicator}>💾 Saving...</span>
        )}
        {!isSaving && lastSaved && (
          <span className={styles.savedIndicator}>
            ✓ Saved at {formatTime(lastSaved)}
          </span>
        )}
      </div>


      <div className={styles.inputGroup}>
        {eventForm.title && (
          <label className={styles.inputLabel}>Event Title *</label>
        )}
        <FormInput
          placeholder="Event title *"
          value={eventForm.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={validationErrors.title ? styles.inputError : ""}
        />
        {validationErrors.title && (
          <p className={styles.errorMessage}>❌ {validationErrors.title}</p>
        )}
      </div>

      <div className={styles.mergedInputs}>
        <div className={styles.inputGroup}>
          {eventForm.dateTime && (
            <label className={styles.inputLabel}>Date and Time *</label>
          )}
          <FormInput
            icon="🗓️"
            placeholder="Date and time *"
            value={eventForm.dateTime}
            onChange={(e) => handleChange("dateTime", e.target.value)}
            type="datetime-local"
            className={validationErrors.dateTime ? styles.inputError : ""}
          />
          {validationErrors.dateTime && (
            <p className={styles.errorMessage}>
              ❌ {validationErrors.dateTime}
            </p>
          )}
        </div>

        <hr className={styles.hr} />

        <div className={styles.inputGroup}>
          {eventForm.location && (
            <label className={styles.inputLabel}>Location</label>
          )}
          <FormInput
            icon="📍"
            placeholder="Location"
            value={eventForm.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={validationErrors.location ? styles.inputError : ""}
          />
          {validationErrors.location && (
            <p className={styles.errorMessage}>
              ⚠️ {validationErrors.location}
            </p>
          )}
        </div>

        <hr className={styles.hr} />

        <div className={styles.inputGroup}>
          {eventForm.costPerPerson && (
            <label className={styles.inputLabel}>Cost per Person</label>
          )}
          <FormInput
            icon="💵"
            placeholder="Cost per person"
            value={eventForm.costPerPerson}
            onChange={(e) => handleChange("costPerPerson", e.target.value)}
            type="number"
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        {eventForm.description && (
          <label className={styles.inputLabel}>Event Description</label>
        )}
        <FormInput
          placeholder="Describe your event"
          value={eventForm.description}
          onChange={(e) => handleChange("description", e.target.value)}
          multiline
          rows={4}
        />
      </div>

      <QuickLinksPanel />

      <CustomizeSection />

      <Button
        variant="primary"
        size="lg"
        onClick={handleGoLive}
        fullWidth
        icon="🚀"
        className={styles.goLiveButton}
        disabled={isPublishing}
      >
        {isPublishing ? "Publishing..." : "Go live"}
      </Button>

      <ConfirmModal
        isOpen={showConfirmPublish}
        title="Publish Event?"
        message="Are you sure you want to publish this event? This will make it visible to others."
        icon="🚀"
        confirmLabel="Publish"
        cancelLabel="Cancel"
        confirmVariant="success"
        isLoading={isPublishing}
        onConfirm={handleConfirmPublish}
        onCancel={() => setShowConfirmPublish(false)}
      />
    </div>
  );
};
