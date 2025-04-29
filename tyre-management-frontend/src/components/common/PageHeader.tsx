import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  onCreateButtonClick: (() => void) | null;
}

const PageHeader = ({ title, onCreateButtonClick }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold">{title}</h2>
      {onCreateButtonClick && (
        <Button
          onClick={onCreateButtonClick!}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + Create
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
