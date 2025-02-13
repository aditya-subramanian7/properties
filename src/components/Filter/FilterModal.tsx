interface FilterModalProps {
  setFilters: (x: string[]) => void;
  filters: string[] | undefined;
  setShowFilterModal: (x: boolean) => void;
}

export default function FilterModal({
  setFilters,
  filters,
  setShowFilterModal,
}: FilterModalProps) {
  return (
    <dialog
      id="my_modal_1"
      className="modal"
      onClose={() => setShowFilterModal(false)}
      open
    >
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
