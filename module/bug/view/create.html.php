<?php
/**
 * The create view of bug module of ZenTaoPMS.
 *
 * @copyright   Copyright 2009-2013 青岛易软天创网络科技有限公司 (QingDao Nature Easy Soft Network Technology Co,LTD www.cnezsoft.com)
 * @license     LGPL (http://www.gnu.org/licenses/lgpl.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     bug
 * @version     $Id: create.html.php 4903 2013-06-26 05:32:59Z wyd621@gmail.com $
 * @link        http://www.zentao.net
 */
?>
<?php
include '../../common/view/header.html.php';
include '../../common/view/form.html.php';
include '../../common/view/chosen.html.php';
include '../../common/view/alert.html.php';
include '../../common/view/kindeditor.html.php';
js::set('holders', $lang->bug->placeholder);
js::set('page', 'create');
js::set('createRelease', $lang->release->create);
js::set('createBuild', $lang->build->create);
js::set('refresh', $lang->refresh);
?>

<form method='post' enctype='multipart/form-data' id='dataform' class='ajaxForm'>
  <table class='table-1'> 
    <caption><?php echo $lang->bug->create;?></caption>
    <tr>
      <th class='rowhead'><?php echo $lang->bug->lblProductAndModule;?></th>
      <td>
        <?php echo html::select('product', $products, $productID, "onchange=loadAll(this.value) class='select-3' autocomplete='off'");?>
        <span id='moduleIdBox'>
        <?php
        echo html::select('module', $moduleOptionMenu, $moduleID, "onchange='loadModuleRelated()'");
        if(count($moduleOptionMenu) == 1)
        {
            echo html::a($this->createLink('tree', 'browse', "rootID=$productID&view=bug"), $lang->tree->manage, '_blank');
            echo html::a("javascript:loadProductModules($productID)", $lang->refresh);
        }
        ?>
        </span>
      </td>
    </tr>  
    <tr>
      <th class='rowhead'><?php echo $lang->bug->project;?></th>
      <td><span id='projectIdBox'><?php echo html::select('project', $projects, $projectID, 'class=select-3 onchange=loadProjectRelated(this.value) autocomplete="off"');?></span></td>
    </tr>
    <tr>
      <th class='rowhead'><?php echo $lang->bug->openedBuild;?></th>
      <td>
        <span id='buildBox'>
        <?php echo html::select('openedBuild[]', $builds, $buildID, 'size=4 multiple=multiple class=select-3');?>
        </span>
      </td>
    </tr>
    <tr>
      <th class='rowhead'><nobr><?php echo $lang->bug->lblAssignedTo;?></nobr></th>
      <td><span id='assignedToBox'><?php echo html::select('assignedTo', $users, $assignedTo, "class='select-3 chosen'");?></span></td>
    </tr>
    <tr>
      <th class='rowhead'><?php echo $lang->bug->title;?></th>
      <td><?php echo html::input('title', $bugTitle, "class='text-1'");?></td>
    </tr>  
    <tr>
      <th class='rowhead'><?php echo $lang->bug->steps;?></th>
      <td>
        <div style='position:relative'>
          <div class='w-p85 bd-none padding-zero f-left'><?php echo html::textarea('steps', $steps, "rows='10'");?></div>
          <div class='bd-none' id='tplBox' style='position:absolute;top:0px;left:86%'><?php echo $this->fetch('bug', 'buildTemplates');?></div>
        </div>
      </td>
    </tr>  
    <tr>
      <th class='rowhead'><?php echo $lang->bug->lblStory;?></th>
      <td>
        <span id='storyIdBox'><?php echo html::select('story', $stories, $storyID);?></span>
      </td>
    </tr>  
    <tr>
      <th class='rowhead'><?php echo $lang->bug->task;?></th>
      <td><span id='taskIdBox'><?php echo html::select('task', $tasks, $taskID);?></span></td>
    </tr>
    <tr>
      <th class='rowhead'><?php echo $lang->bug->lblTypeAndSeverity;?></th>
      <td> 
        <?php echo html::select('type', $lang->bug->typeList, $type, 'class=select-2');?> 
        <?php echo html::select('severity', $lang->bug->severityList, $severity, 'class=select-2');?>
      </td>
    </tr>
    <tr>
      <th class='rowhead'><nobr><?php echo $lang->bug->lblSystemBrowserAndHardware;?></nobr></th>
      <td>
        <?php echo html::select('os', $lang->bug->osList, $os, 'class=select-2');?>
        <?php echo html::select('browser', $lang->bug->browserList, $browser, 'class=select-2');?>
      </td>
    </tr>
    <tr>
      <th class='rowhead'><nobr><?php echo $lang->bug->lblMailto;?></nobr></th>
      <td>
        <?php 
        echo html::select('mailto[]', $users, str_replace(' ', '', $mailto), 'class=text-1 multiple');
        if($contactLists) echo html::select('', $contactLists, '', "class='f-right' onchange=\"setMailto('mailto', this.value)\"");
        ?>
      </td>
    </tr>
    <tr>
      <th class='rowhead'><?php echo $lang->bug->keywords;?></th>
      <td><?php echo html::input('keywords', $keywords, "class='text-1'");?></td>
    </tr>
    <tr>
      <th class='rowhead'><?php echo $lang->bug->files;?></th>
      <td><?php echo $this->fetch('file', 'buildform', 'fileCount=2&percent=0.85');?></td>
    </tr>  
    <tr>
      <td colspan='2' class='a-center'>
        <?php echo html::submitButton() . html::backButton() . html::hidden('case', $caseID);?>
      </td>
    </tr>
  </table>
</form>
<?php include '../../common/view/footer.html.php';?>
