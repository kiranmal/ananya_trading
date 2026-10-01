import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import BusinessCardCustomizer, {
  TemplatePreview,
} from "../../pages/BusinessCardCustomizer";
import {
  createProductTemplate,
  deleteProductTemplate,
  fetchAdminProductTemplates,
  updateProductTemplate,
} from "../../services/templateApi";

import "./ProductTemplates.css";

/* ============================================================
   PRODUCT TEMPLATES — managed INSIDE the product form.
   Each template belongs to exactly this product (product_id).
   - productId === null (Add Product): local list, parent
     saves them after the product is created
   - productId set (Edit Product): immediate API CRUD
============================================================ */

const CARD_TYPES = ["business-card"];

export default function ProductTemplates({
  enabled,
  customizationType,
  productId = null,
  productName = "",
  templates,
  onChange,
}) {
  const [designerOpen, setDesignerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const supportsDesigner =
    CARD_TYPES.includes(String(customizationType || "").toLowerCase());

  /* EDIT MODE — load this product's templates */
  useEffect(() => {
    if (!enabled || !productId) return;

    let cancelled = false;
    fetchAdminProductTemplates(productId)
      .then((list) => {
        if (!cancelled) onChange(list);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [enabled, productId]);

  if (!enabled) return null;

  /* ---------- helpers ---------- */

  const persistUpdate = async (index, patch) => {
    const t = templates[index];
    if (!t) return;

    /* local (unsaved product) — just update state */
    if (!productId || !t.id || t._local) {
      onChange(
        templates.map((x, i) =>
          i === index ? { ...x, ...patch } : x
        )
      );
      return;
    }

    setBusy(true);
    setError("");
    try {
      const saved = await updateProductTemplate(
        productId,
        t.id,
        patch
      );
      onChange(
        templates.map((x, i) =>
          i === index ? saved : x
        )
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const addTemplate = async () => {
    const draft = {
      name: `Template ${templates.length + 1}`,
      status: "Active",
      design: null,
      sortOrder: templates.length,
    };

    if (!productId) {
      onChange([
        ...templates,
        { ...draft, _local: true, id: `local-${Date.now()}` },
      ]);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const saved = await createProductTemplate(
        productId,
        draft
      );
      onChange([...templates, saved]);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const removeTemplate = async (index) => {
    const t = templates[index];
    if (!t) return;
    if (!window.confirm(`Delete template "${t.name}"?`)) return;

    if (!productId || !t.id || t._local) {
      onChange(templates.filter((_, i) => i !== index));
      return;
    }

    setBusy(true);
    setError("");
    try {
      await deleteProductTemplate(productId, t.id);
      onChange(templates.filter((_, i) => i !== index));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const moveTemplate = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= templates.length) return;

    const next = [...templates];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((t, i) => ({ ...t, sortOrder: i })));

    /* persist order when the product exists */
    if (productId) {
      try {
        await Promise.all(
          next
            .filter((t) => t.id && !t._local)
            .map((t, i) =>
              updateProductTemplate(productId, t.id, {
                sortOrder: i,
              })
            )
        );
      } catch {
        /* order persists best-effort */
      }
    }
  };

  const openDesigner = (index) => {
    setEditingIndex(index);
    setDesignerOpen(true);
  };

  const handleSaveDesign = async ({ frontDesign, backDesign }) => {
    const design = { frontDesign, backDesign };
    await persistUpdate(editingIndex, { design });
    setDesignerOpen(false);
    setEditingIndex(null);
  };

  const editing = templates[editingIndex] || null;

  /* ---------- render ---------- */

  return (
    <div className="pt-section">
      <label className="pt-heading">
        CUSTOMIZATION TEMPLATES
      </label>
      <p className="pt-sub">
        Create templates that customers can choose when
        customizing this product.
      </p>

      {error && <p className="pt-error">{error}</p>}

      {templates.length === 0 && (
        <p className="pt-empty">No templates added.</p>
      )}

      <div className="pt-list">
        {templates.map((t, index) => (
          <div
            className="pt-row"
            key={t.id || `tpl-${index}`}
          >
            <div className="pt-thumb">
              {t.design?.frontDesign ? (
                <TemplatePreview tpl={t.design} />
              ) : (
                <span className="pt-thumb-empty">
                  No design
                </span>
              )}
            </div>

            <input
              className="pt-name"
              type="text"
              value={t.name}
              maxLength={60}
              onChange={(e) =>
                persistUpdate(index, {
                  name: e.target.value,
                })
              }
            />

            <button
              type="button"
              className={`pt-status ${
                t.status === "Inactive" ? "off" : ""
              }`}
              title="Toggle Active/Inactive"
              onClick={() =>
                persistUpdate(index, {
                  status:
                    t.status === "Inactive"
                      ? "Active"
                      : "Inactive",
                })
              }
            >
              {t.status === "Inactive" ? (
                <EyeOff size={13} />
              ) : (
                <Eye size={13} />
              )}
              {t.status || "Active"}
            </button>

            <div className="pt-actions">
              {supportsDesigner && (
                <button
                  type="button"
                  className="pt-btn"
                  title="Open designer"
                  onClick={() => openDesigner(index)}
                >
                  <Pencil size={13} /> Design
                </button>
              )}
              <button
                type="button"
                className="pt-btn"
                title="Move up"
                disabled={index === 0 || busy}
                onClick={() => moveTemplate(index, -1)}
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                className="pt-btn"
                title="Move down"
                disabled={
                  index === templates.length - 1 || busy
                }
                onClick={() => moveTemplate(index, 1)}
              >
                <ArrowDown size={13} />
              </button>
              <button
                type="button"
                className="pt-btn danger"
                title="Delete"
                disabled={busy}
                onClick={() => removeTemplate(index)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="pt-add"
        disabled={busy}
        onClick={addTemplate}
      >
        <Plus size={14} /> Add Template
      </button>

      {!supportsDesigner && (
        <p className="pt-note">
          Visual designer is available for Business Card
          products. Other customization types store
          template names only.
        </p>
      )}

      {/* designer overlay — reuses the existing
          business-card engine (embedded mode) */}
      {designerOpen && editing && (
        <div className="pt-designer-overlay">
          <div className="pt-designer-modal">
            <div className="pt-designer-head">
              <strong>
                Template Designer — {editing.name}
              </strong>
            </div>
            <BusinessCardCustomizer
              embedded
              propProduct={{
                id: productId,
                name: productName,
              }}
              initialDesign={editing.design}
              onSaveTemplate={handleSaveDesign}
              onCancel={() => {
                setDesignerOpen(false);
                setEditingIndex(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
