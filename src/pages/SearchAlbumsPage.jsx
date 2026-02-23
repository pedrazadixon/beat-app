import PageContent from "../layouts/PageContent";
import PageHeader from "../layouts/PageHeader";
import PageLayout from "../layouts/PageLayout";
import SearchAlbumsResults from "../components/SearchAlbumsResults";
import SearchInput from "../components/SearchInput";
import SearchTabs from "../components/SearchTabs";

export default function SearchAlbumsPage() {
  return (
    <PageLayout>
      <PageHeader>
        <SearchInput />
        <SearchTabs />
      </PageHeader>
      <PageContent>
        <SearchAlbumsResults />
      </PageContent>
    </PageLayout>
  );
}
