import PageContent from "../layouts/PageContent";
import PageHeader from "../layouts/PageHeader";
import PageLayout from "../layouts/PageLayout";
import SearchArtistsResults from "../components/SearchArtistsResults";
import SearchInput from "../components/SearchInput";
import SearchTabs from "../components/SearchTabs";

export default function SearchArtistsPage() {
  return (
    <PageLayout>
      <PageHeader>
        <SearchInput />
        <SearchTabs />
      </PageHeader>
      <PageContent>
        <SearchArtistsResults />
      </PageContent>
    </PageLayout>
  );
}
