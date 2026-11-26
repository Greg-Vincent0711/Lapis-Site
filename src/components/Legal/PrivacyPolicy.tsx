import { Link } from "react-router-dom";
import LegalPage from "./LegalPage";
import { CONTACT_EMAIL } from "./legalConfig";

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" related={{ to: "/data-usage", label: "Data Usage Policy" }}>
      <div className="legal_summary">
        <p>
          <strong>The short version:</strong> Lapis collects only what it needs to save and show
          your Minecraft locations. We don't sell your data, show ads, or run third-party analytics
          or tracking.
        </p>
      </div>

      <h2>1. Who we are</h2>
      <p>
        Lapis is an independent hobby project. It is made up of the Lapis Discord bot and this
        companion website (together, “Lapis” or “the Service”), and it helps Minecraft players save
        and look up locations in their worlds. In this policy, “we” and “us” mean the developer who
        runs Lapis, and “you” means anyone who uses the bot or the website.
      </p>

      <h2>2. Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Account details:</strong> your name, email address and password when you sign up
          on the website. Passwords are handled by Amazon Cognito, our sign-in provider. We never
          see or store your password in plain text.
        </li>
        <li>
          <strong>Saved locations:</strong> the name, dimension (Overworld, Nether or The End) and
          X/Y/Z coordinates of each location you save.
        </li>
        <li>
          <strong>Images:</strong> any PNG or JPEG images you attach to a saved location.
        </li>
        <li>
          <strong>Minecraft world seeds:</strong> the seed you set with <code>!setSeed</code>, which
          lets Lapis answer structure, biome and spawn questions about your world.
        </li>
      </ul>

      <h3>Information from Discord</h3>
      <ul>
        <li>
          <strong>When you use the bot:</strong> Discord sends us your Discord user ID and the
          content of the Lapis command you sent. Your user ID is how Lapis keeps your saved data
          separate from everyone else's.
        </li>
        <li>
          <strong>When you link Discord to the website:</strong> with your permission, Discord
          shares your user ID, username and email address (the <code>identify</code> and{" "}
          <code>email</code> scopes). We use them to connect your website account to the locations
          you saved through the bot.
        </li>
      </ul>

      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Sign-in tokens:</strong> while you're signed in, the website keeps session tokens
          in your browser's local storage so you stay logged in. See{" "}
          <a href="#cookies">Cookies and local storage</a>.
        </li>
        <li>
          <strong>Server logs:</strong> like most websites, our hosting provider (Amazon Web
          Services) may record basic request information such as your IP address, browser type and
          the time of the request. These logs are used for security and troubleshooting.
        </li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To provide the Service: saving, showing, updating and deleting your locations, images and seeds.</li>
        <li>To create and secure your account, and to keep you signed in.</li>
        <li>To link your Discord account to your website account.</li>
        <li>To keep Lapis secure, prevent abuse and fix problems.</li>
        <li>To meet legal obligations when required.</li>
      </ul>
      <p>
        We don't use your information for advertising or profiling, and we don't sell it. The{" "}
        <Link to="/data-usage">Data Usage Policy</Link> lists each type of data alongside what it's
        used for.
      </p>

      <h2>4. How we share information</h2>
      <p>We share information only in these cases:</p>
      <ul>
        <li>
          <strong>Service providers</strong> that run Lapis on our behalf:
          <ul>
            <li>Amazon Web Services: hosting, databases, image storage and sign-in (Amazon Cognito).</li>
            <li>Discord: the platform the bot runs on, and the account-linking (OAuth) flow.</li>
            <li>
              Google Fonts: the website loads its font from Google, which receives your IP address
              when the font is downloaded.
            </li>
          </ul>
        </li>
        <li>
          <strong>Legal reasons:</strong> if the law requires it, or to protect the rights, safety
          or property of Lapis, its users or others.
        </li>
        <li>
          <strong>With your direction:</strong> for example, if you share a location or image in a
          Discord channel, the people in that channel can see it.
        </li>
      </ul>

      <h2>5. Where your data is stored and how it's protected</h2>
      <p>
        Lapis data is stored on Amazon Web Services in the United States (us-east-1). Access to
        your data needs a valid sign-in token, and credentials are kept in AWS Secrets Manager
        instead of in the code. No system is perfectly secure, so please don't save anything
        sensitive in a location name or image.
      </p>

      <h2>6. How long we keep data</h2>
      <p>
        We keep your account and saved data until you delete it or ask us to delete your account.
        When you delete a location, its attached image is deleted too. Server logs are kept only as
        long as needed for security and troubleshooting.
      </p>

      <h2>7. Your choices and rights</h2>
      <ul>
        <li>
          <strong>View, edit and delete:</strong> you can view, update and delete your locations and
          images at any time, from the dashboard or with bot commands (<code>!list</code>,{" "}
          <code>!update</code>, <code>!delete</code>, <code>!deleteImg</code>).
        </li>
        <li>
          <strong>Unlink Discord:</strong> you can remove Lapis's access from Discord under{" "}
          <em>User Settings → Authorized Apps</em>.
        </li>
        <li>
          <strong>Delete your account or get a copy of your data:</strong> email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from your account's email address
          and we'll handle it within 30 days.
        </li>
      </ul>
      <p>
        Depending on where you live (for example in the EU, the UK or California), you may have
        further rights to access, correct, delete or move your data, or to object to how it's used.
        Contact us to use any of these rights. We won't treat you differently for using them.
      </p>

      <h2>8. Children</h2>
      <p>
        Lapis is not meant for children under 13, and Discord requires its users to be at least
        13. We don't knowingly collect data from children under 13. If you think a child has given
        us information, contact us and we'll delete it.
      </p>

      <h2 id="cookies">9. Cookies and local storage</h2>
      <p>
        The website does not use advertising or analytics cookies. It uses your browser's local
        storage only for the sign-in tokens that keep you logged in. Signing out removes them.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        If we change this policy, we'll update the effective date at the top of this page. For
        significant changes, we'll also post a notice on the website or through the bot.
      </p>

      <h2>11. Contact</h2>
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with any questions about
        this policy or your data.
      </p>
    </LegalPage>
  );
}
