import { Link } from "react-router-dom";
import LegalPage from "./LegalPage";
import { CONTACT_EMAIL } from "./legalConfig";

type DataRow = {
  data: string;
  source: string;
  purpose: string;
  storage: string;
  retention: string;
};

const DATA_ROWS: DataRow[] = [
  {
    data: "Name, email, password",
    source: "Website sign-up",
    purpose: "Creating and signing in to your account",
    storage: "Amazon Cognito (passwords are never stored in plain text)",
    retention: "Until you ask us to delete your account",
  },
  {
    data: "Discord user ID",
    source: "Bot commands, Discord linking",
    purpose: "Keeping your saved data separate from other users' data",
    storage: "DynamoDB",
    retention: "Until you ask us to delete your account",
  },
  {
    data: "Discord username and email",
    source: "Discord linking (OAuth)",
    purpose: "Connecting your Discord account to your website account",
    storage: "Used during linking",
    retention: "Until you unlink Discord or delete your account",
  },
  {
    data: "Location names, dimensions, coordinates",
    source: "You (bot or dashboard)",
    purpose: "Saving and showing your locations",
    storage: "DynamoDB",
    retention: "Until you delete the location",
  },
  {
    data: "Location images",
    source: "You (bot or dashboard)",
    purpose: "Showing an image with a saved location",
    storage: "Amazon S3",
    retention: "Until you delete the image or its location",
  },
  {
    data: "Minecraft world seed",
    source: "You (!setSeed)",
    purpose: "Finding structures, biomes and spawns in your world",
    storage: "DynamoDB, cached for faster lookups",
    retention: "Until you replace it or delete your account",
  },
  {
    data: "Sign-in tokens",
    source: "Created when you sign in",
    purpose: "Keeping you signed in to the website",
    storage: "Your browser's local storage",
    retention: "Until you sign out or the token expires",
  },
  {
    data: "IP address, request logs",
    source: "Collected automatically",
    purpose: "Security, preventing abuse, troubleshooting",
    storage: "AWS service logs",
    retention: "Only as long as needed for those purposes",
  },
];

export default function DataUsagePolicy() {
  return (
    <LegalPage title="Data Usage Policy" related={{ to: "/privacy", label: "Privacy Policy" }}>
      <div className="legal_summary">
        <p>
          This page lists each type of data Lapis handles, why it's needed, where it's kept and
          how long it's kept. It adds detail to our{" "}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </div>

      <h2>What we use and why</h2>
      <div className="legal_table_wrap" role="region" aria-label="Data Lapis uses" tabIndex={0}>
        <table className="legal_table">
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Comes from</th>
              <th scope="col">Used for</th>
              <th scope="col">Stored in</th>
              <th scope="col">How long</th>
            </tr>
          </thead>
          <tbody>
            {DATA_ROWS.map((row) => (
              <tr key={row.data}>
                <th scope="row">{row.data}</th>
                <td>{row.source}</td>
                <td>{row.purpose}</td>
                <td>{row.storage}</td>
                <td>{row.retention}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What we don't do</h2>
      <ul>
        <li>We don't sell, rent or trade your data.</li>
        <li>We don't show ads or share data with advertisers.</li>
        <li>We don't use third-party analytics or tracking tools.</li>
        <li>We don't use your locations, images or seeds to train AI models.</li>
        <li>
          The bot only acts on messages that start with a Lapis command. We don't store your other
          Discord messages.
        </li>
        <li>We never ask for your Discord password, and we never see it.</li>
      </ul>

      <h2>Who can see your data</h2>
      <ul>
        <li>
          <strong>You:</strong> saved data is tied to your Discord user ID and website account, so
          bot commands and the dashboard only ever return your own data.
        </li>
        <li>
          <strong>Other people in a Discord channel:</strong> bot replies are posted where you send
          the command. If you run <code>!get</code> or <code>!list</code> in a shared channel,
          people in that channel can see the result.
        </li>
        <li>
          <strong>People with an image link:</strong> images are served from a link. Treat images
          as viewable by anyone who has their link, and don't upload anything private.
        </li>
        <li>
          <strong>The developer:</strong> only to run, secure and fix the Service, or when you ask
          for help.
        </li>
      </ul>

      <h2>Limits on what you upload</h2>
      <ul>
        <li>Images must be PNG or JPEG and 4 MB or smaller.</li>
        <li>Each user can save up to 10 locations.</li>
        <li>
          Don't save personal, sensitive or illegal content in a location name or image. We may
          remove content that breaks Discord's rules or the law.
        </li>
      </ul>

      <h2>Controlling and deleting your data</h2>
      <ul>
        <li>
          <strong>Locations and images:</strong> edit or delete them on the{" "}
          <Link to="/dashboard">dashboard</Link>, or with <code>!update</code>,{" "}
          <code>!delete</code> and <code>!deleteImg</code>. Deleting a location also deletes its
          image.
        </li>
        <li>
          <strong>Discord link:</strong> go to Discord <em>User Settings → Authorized Apps</em> and
          remove Lapis.
        </li>
        <li>
          <strong>Everything:</strong> email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from your account's email address.
          We'll delete your account, locations, images and seed within 30 days.
          You can also send <a href="discord://-users/729393558548643901"> Mugiwara1423 </a> a message on Discord.
        </li>
      </ul>
    </LegalPage>
  );
}
