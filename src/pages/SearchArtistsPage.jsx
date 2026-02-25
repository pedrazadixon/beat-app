import PageContent from "../layouts/PageContent";
import PageHeader from "../layouts/PageHeader";
import PageLayout from "../layouts/PageLayout";
import SearchArtistsResults from "../components/SearchArtistsResults";
import SearchTabs from "../components/SearchTabs";

export default function SearchArtistsPage() {
  return (
    <PageLayout>
      <PageHeader>
        <SearchTabs />
      </PageHeader>
      <PageContent>
        <SearchArtistsResults />
      </PageContent>
    </PageLayout>
  );
}
