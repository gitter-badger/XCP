<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">XCP Web</a>
    </div>
    <div id="navbar" class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
        <li <?php echoActiveClassIfRequestMatches("index"); ?>><a href="index.php">Home</a></li>
        <li <?php echoActiveClassIfRequestMatches("activity"); ?>><a href="activity.php">Activity Tracker</a></li>
        
         <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Exclutions <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li <?php echoActiveClassIfRequestMatches("addexclution"); ?>><a href="addexclution.php" >Exclude Content</a></li>
            <li <?php echoActiveClassIfRequestMatches("viewexclution"); ?>><a href="viewexclution.php" >View Excluded Content</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Admin <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li <?php echoActiveClassIfRequestMatches("flow"); ?>><a href="flow.php" ><i class="fa fa-random"></i> Manage Activity Flow</a></li>
            <li <?php echoActiveClassIfRequestMatches("dumpAudit"); ?>><a href="dumpAudit.php"><i class="fa fa-download"></i> Dump Audit (xls)</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Reports <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li <?php echoActiveClassIfRequestMatches("rep"); ?>><a href="rep.php" ><i class="fa fa-random"></i> Test reports</a></li>
          </ul>
        </li>
      </ul>
    <?php
    if($user->isLoggedIn()){
      ?>
      <p class="navbar-text navbar-right"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> <a href="changepassword.php" class="navbar-link"><?php echo $user->data()->username . " (" . $user->group() . ")"; ?></a> | <a href="logout.php" class="navbar-link">sign out</a></p>
      <?php
    } else {
      ?>
      <p class="navbar-text navbar-right"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> <a href="login.php" class="navbar-link">Log In</a></p>
      <?php
    }
    ?>

    </div><!--/.nav-collapse -->

  </div><!--/.container-fluid -->
</nav>


