import Charts from "../components/Charts";
import PageLayout from "../layouts/PageLayout";
import PageHeader from "../layouts/PageHeader";
import PageContent from "../layouts/PageContent";
import SearchInput from "../components/SearchInput";

export default function SearchPage() {
  return (
    <PageLayout>
      <PageHeader>
        <SearchInput />
      </PageHeader>
      <PageContent>
        <Charts />
      </PageContent>
    </PageLayout>
  );
}
